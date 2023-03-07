import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Filter, FilterValue } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { AppLauncher } from '@capacitor/app-launcher';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  public appName: string = environment.appName;
  public menuNavigation: boolean = !(environment.navigation === 'tabs');
  public practiceValues!: FilterValue[] | undefined;
  public filters!: Filter[] | undefined;
  private filtersSubscription!: Subscription;

  constructor(
    private settings: SettingsService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.filtersSubscription = this.settings.filters$.subscribe((filters) => {
      this.filters = cloneDeep(filters!);
      this.practiceValues = filters!.find(
        (filter) => filter.id === 'practice'
      )!.values;
    });
  }

  ngOnDestroy() {
    this.filtersSubscription.unsubscribe();
  }

  public filterAndGo(practice: FilterValue) {
    this.filters!.find((filter) => filter.id === 'practice')!.values.forEach(
      (value) => (value.checked = practice.id === value.id)
    );
    this.settings.saveFiltersState(this.filters!);
    this.router.navigate(['/tabs/treks']);
  }

  public goToEmergency() {
    this.router.navigate(['/tabs/emergency']);
  }

  public async goToReport() {
    if (this.platform.is('android')) {
      if (
        await AppLauncher.canOpenUrl({
          url: `com.suricate`
        })
      ) {
        await AppLauncher.openUrl({
          url: `com.suricate`
        });
      } else {
        window.open(
          `https://play.google.com/store/apps/details?id=com.suricate&hl=fr`,
          '_blank'
        );
      }
    } else if (this.platform.is('ios')) {
      await AppLauncher.openUrl({
        url: `https://apps.apple.com/fr/app/suricate-sports-de-nature/id1077352900`
      });
    }
  }
}
