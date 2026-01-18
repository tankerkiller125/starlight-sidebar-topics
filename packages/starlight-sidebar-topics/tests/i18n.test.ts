import { expect, test } from './test'

test('uses translations for topics labels and badges', async ({ docPage }) => {
  await docPage.goto('/getting-started/', 'fr')

  expect(await docPage.getTopics()).toEqual(['Documentation', 'Démo Ébauche', 'Starlight Docs'])
})

test('uses translations property for topic labels', async ({ demoPage }) => {
  // Test English (default)
  await demoPage.goto()
  const topicsEn = await demoPage.page.locator('.starlight-sidebar-topics a').allTextContents()
  // Find the Demo topic by checking for "Demo Stub" text
  expect(topicsEn.some((topic) => topic.includes('Demo Stub'))).toBe(true)

  // Test French translation
  await demoPage.goto('/', 'fr')
  const topicsFr = await demoPage.page.locator('.starlight-sidebar-topics a').allTextContents()
  // Find the Démo topic by checking for "Démo Ébauche" text
  expect(topicsFr.some((topic) => topic.includes('Démo Ébauche'))).toBe(true)
})
