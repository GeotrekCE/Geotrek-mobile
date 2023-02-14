import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filter, FilterValue } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

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

  constructor(private settings: SettingsService, private router: Router) {}

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
}
