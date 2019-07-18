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
    page.navigateTo();
    browser.driver.sleep(5000);
    browser.getProcessedConfig().then(config => {
      browser.takeScreenshot().then(png => {
        writeScreenShot(png, `e2e/screens/${config.capabilities.chromeOptions.mobileEmulation.name}/treks.png`);
      });
    });
  });
});
