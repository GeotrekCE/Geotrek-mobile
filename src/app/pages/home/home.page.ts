import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Filter, FilterValue } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

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
  public outdoorPractices!: any[] | undefined;
  private outdoorPracticesSubscription!: Subscription;

  constructor(
    private settings: SettingsService,
    private router: Router,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.filtersSubscription = this.settings.filters$.subscribe((filters) => {
      this.filters = cloneDeep(filters!);
      this.practiceValues = filters!.find(
        (filter) => filter.id === 'practice'
      )!.values;
    });

    this.outdoorPracticesSubscription =
      this.settings.outdoorPractices$.subscribe((outdoorPractices) => {
        this.outdoorPractices = cloneDeep(outdoorPractices!);
      });
  }

  ngOnDestroy() {
    this.filtersSubscription.unsubscribe();
    this.outdoorPracticesSubscription.unsubscribe();
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

  public async GoToOutdoorPractice(practice: any) {
    const alert = await this.alertController.create({
      header: await this.translate.get('outdoorPractice.title').toPromise(),
      message: await this.translate.get('outdoorPractice.message').toPromise(),
      buttons: [
        {
          text: await this.translate.get('outdoorPractice.cancel').toPromise(),
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: await this.translate.get('outdoorPractice.confirm').toPromise(),
          handler: () => {
            window.open(
              `${environment.randoUrl}search?outdoorPractice=${practice.id}`,
              '_blank'
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
