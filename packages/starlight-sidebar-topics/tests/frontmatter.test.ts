import { expect, test } from './test'

test('preserves frontmatter badge properties from content files', async ({ demoPage }) => {
  await demoPage.goto('/api/build/')

  // Check that the "build" page has a badge from its frontmatter
  const buildLink = demoPage.page.locator('a[href="/demo/api/build/"]')
  const badge = buildLink.locator('.sl-badge')
  
  await expect(badge).toBeVisible()
  await expect(badge).toHaveText('Deprecated')
  await expect(badge).toHaveClass(/caution/)
})

test('preserves frontmatter badge properties for simple badges', async ({ demoPage }) => {
  await demoPage.goto('/components/demo/')

  // Check that the "<Demo />" page has a badge from its frontmatter
  const demoLink = demoPage.page.locator('a[href="/demo/components/demo/"]')
  const badge = demoLink.locator('.sl-badge')
  
  await expect(badge).toBeVisible()
  await expect(badge).toHaveText('New')
  await expect(badge).toHaveClass(/default/)
})

test('preserves frontmatter order properties', async ({ docPage }) => {
  await docPage.goto('/getting-started/')

  const guidesSidebarItems = await docPage.getSidebarItems()
  
  // Check that pages with sidebar.order frontmatter are ordered correctly
  // "Unlisted Pages" has order: 1, "Excluded Pages" has order: 2
  const unlistedIndex = guidesSidebarItems.indexOf('Unlisted Pages')
  const excludedIndex = guidesSidebarItems.indexOf('Excluded Pages')
  const customTopicIndex = guidesSidebarItems.indexOf('Custom Topic List')
  
  expect(unlistedIndex).toBeLessThan(excludedIndex)
  expect(excludedIndex).toBeLessThan(customTopicIndex)
})
