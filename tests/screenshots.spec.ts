import { test, expect } from '@playwright/test';

test('Screenshots', async ({ page }, config) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'CapacitorStorage.alreadyAskGeolocationPermission',
      'true'
    );
  });

  await page.goto('http://localhost:8100/tabs/treks', {
    waitUntil: 'networkidle'
  });
  await page.screenshot({
    path: `screenshots/${config.project.name}/treks.png`
  });

  await page.getByRole('list').locator('div').first().click();
  await page.waitForURL('**/trek-details/**');
  await expect(page.locator('app-treks')).toBeHidden();
  await page.screenshot({
    path: `screenshots/${config.project.name}/trek-details.png`
  });

  await page.locator('app-trek-details ion-fab-button').click();
  await page.waitForURL('**/map/**', {
    waitUntil: 'networkidle'
  });
  await page.evaluate(
    () =>
      new Promise(async (resolve) => {
        while (!window.hasOwnProperty('trekMap'))
          await new Promise((resolve) => setTimeout(resolve, 20));
        return (window as any).trekMap.once('load', resolve);
      })
  );
  await page.screenshot({
    path: `screenshots/${config.project.name}/trek-map.png`
  });

  await page.goto('http://localhost:8100/tabs/treks', {
    waitUntil: 'networkidle'
  });
  await page.locator('app-treks ion-fab-button').click();
  await page.evaluate(async () => {
    while (!window.hasOwnProperty('treksMap'))
      await new Promise((resolve) => setTimeout(resolve, 20));
    return new Promise((resolve) =>
      (window as any).treksMap.once('load', resolve)
    );
  });
  await page.screenshot({
    path: `screenshots/${config.project.name}/treks-map.png`
  });
});
