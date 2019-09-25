import { AppPage } from './app.po';
import { browser } from 'protractor';
import { createWriteStream, existsSync } from 'fs';
import * as path from 'path';
const { mkdirp } = require('mkdirp');

const writeScreenShot = (data: any, fileName: any) => {
  const filePath = path.dirname(fileName);
  if (!existsSync(filePath)) {
    mkdirp.sync(filePath); // creates multiple folders if they don't exist
  }

  const stream = createWriteStream(fileName);
  stream.write(Buffer.from(data, 'base64'));
  stream.end();
};

describe('new App', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
  });

  it('Screen Treks', async () => {
    const config = await browser.getProcessedConfig();

    page.navigateToTreks();
    browser.driver.sleep(5000);
    const png = await browser.takeScreenshot();
    writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/treks.png`);
  });

  it('Screen Global Map', async () => {
    const config = await browser.getProcessedConfig();

    page.navigateToTreksMap();
    browser.driver.sleep(5000);
    const png = await browser.takeScreenshot();
    writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/treks-map.png`);
  });

  it('Screen Trek', async () => {
    const config = await browser.getProcessedConfig();

    page.navigateToTrek('realTrekId');
    browser.driver.sleep(5000);
    const png = await browser.takeScreenshot();
    writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/trek.png`);
  });

  it('Screen Trek Map', async () => {
    const config = await browser.getProcessedConfig();

    page.navigateToTrekMap('realTrekId');
    browser.driver.sleep(5000);
    const png = await browser.takeScreenshot();
    writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/trek-map.png`);
  });
});
