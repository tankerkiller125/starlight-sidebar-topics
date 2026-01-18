import type { APIContext } from 'astro'
import { AstroError } from 'astro/errors'
import starlightConfig from 'virtual:starlight/user-config'

import { stripTrailingSlash } from './pathname'

const defaultLang = starlightConfig.defaultLocale.lang ?? starlightConfig.defaultLocale.locale ?? 'en'

export function getLocalizedSlug(slug: string, locale: string | undefined): string {
  const slugLocale = getLocaleFromSlug(slug)
  if (slugLocale === locale) return slug
  locale ??= ''
  if (slugLocale === slug) return locale

  if (slugLocale) {
    return stripTrailingSlash(slug.replace(`${slugLocale}/`, locale ? `${locale}/` : ''))
  }

  return slug ? `${locale}/${slug}` : locale
}

export function getLocaleFromSlug(slug: string): string | undefined {
  const locales = Object.keys(starlightConfig.locales ?? {})
  const baseSegment = slug.split('/')[0]
  return baseSegment && locales.includes(baseSegment) ? baseSegment : undefined
}

export function getTranslation(
  currentLocale: APIContext['currentLocale'],
  translations: Record<string, string>,
  link: string,
  description: string,
) {
  const defaultTranslation = translations[defaultLang]

  if (!defaultTranslation) {
    throw new AstroError(
      `The ${description} for "${link}" must have a key for the default language "${defaultLang}".`,
      'Update the Starlight config to include a topic label for the default language.',
    )
  }

  let translation = defaultTranslation

  if (currentLocale) {
    translation = translations[currentLocale] ?? defaultTranslation
  }

  return translation
}

/**
 * Resolves a translation from either an object notation or a string with separate translations property.
 *
 * Supports two syntaxes:
 * 1. Object notation: { en: 'English', es: 'Spanish' }
 * 2. String with translations: value = 'English', translations = { es: 'Spanish' }
 */
export function resolveTranslation(
  currentLocale: APIContext['currentLocale'],
  value: string | Record<string, string>,
  translations: Record<string, string> | undefined,
  link: string,
  description: string,
): string {
  // If value is a string and translations are provided, combine them
  if (typeof value === 'string') {
    // If no translations property is provided, return the string value
    if (!translations) {
      return value
    }

    // Create a translations map with the string value as default and merge with translations
    // Note: translations should not contain the default language key to avoid overriding
    const translationsMap: Record<string, string> = {
      ...translations,
      [defaultLang]: value,
    }

    return getTranslation(currentLocale, translationsMap, link, description)
  }

  // If value is an object (old syntax), use it directly
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return getTranslation(currentLocale, value, link, description)
  }

  // This should never be reached but TypeScript requires a return
  return String(value)
}
