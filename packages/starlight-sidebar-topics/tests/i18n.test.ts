import { expect, test } from './test'

test('uses translations for topics labels and badges', async ({ docPage }) => {
  await docPage.goto('/getting-started/', 'fr')

  expect(await docPage.getTopics()).toEqual(['Documentation', 'Démo Ébauche', 'Starlight Docs'])
})

test('uses translations property for topic labels', async ({ demoPage }) => {
  // Test English (default)
  await demoPage.goto()
  const topicsEn = await demoPage.page.locator('.starlight-sidebar-topics a').allTextContents()
  expect(topicsEn[1]).toContain('Demo Stub')

  // Test French translation
  await demoPage.goto('/', 'fr')
  const topicsFr = await demoPage.page.locator('.starlight-sidebar-topics a').allTextContents()
  expect(topicsFr[1]).toContain('Démo Ébauche')
})
