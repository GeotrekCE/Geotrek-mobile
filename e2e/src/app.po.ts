import { browser } from 'protractor';

export class AppPage {
  navigateToTreks() {
    return browser.get('/');
  }

  navigateToTreksMap() {
    return browser.get('/app/tabs/treks/treks-map');
  }

  navigateToTrek(id: string) {
    return browser.get(`/app/tabs/treks/trek-details/${id}`);
  }

  navigateToTrekMap(id: string) {
    return browser.get(`/app/map/${id}`);
  }
}
