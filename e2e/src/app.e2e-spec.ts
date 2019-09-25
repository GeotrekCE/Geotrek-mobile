import { AppPage } from './app.po';
import { browser } from 'protractor';
import { createWriteStream } from 'fs';

const writeScreenShot = (data: any, filename: any) => {
  const stream = createWriteStream(filename);
  stream.write(Buffer.from(data, 'base64'));
  stream.end();
};

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Screen Treks', () => {
    page.navigateToTreks();
    browser.driver.sleep(5000);
    browser.getProcessedConfig().then(config => {
      browser.takeScreenshot().then(png => {
        writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/treks.png`);
      });
    });
  });

  it('Screen Global Map', () => {
    page.navigateToTreksMap();
    browser.driver.sleep(5000);
    browser.getProcessedConfig().then(config => {
      browser.takeScreenshot().then(png => {
        writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/treks-map.png`);
      });
    });
  });

  it('Screen Trek', () => {
    page.navigateToTrek('realTrekId');
    browser.driver.sleep(5000);
    browser.getProcessedConfig().then(config => {
      browser.takeScreenshot().then(png => {
        writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/trek.png`);
      });
    });
  });

  it('Screen Trek Map', () => {
    page.navigateToTrekMap('realTrekId');
    browser.driver.sleep(5000);
    browser.getProcessedConfig().then(config => {
      browser.takeScreenshot().then(png => {
        writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/trek-map.png`);
      });
    });
  });
});
