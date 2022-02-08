import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { FilterComponent } from './filter.component';

import { FilterValueComponent } from '@app/components/filter-value/filter-value.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule.forChild()],
  declarations: [FilterComponent, FilterValueComponent],
  exports: [FilterComponent, FilterValueComponent]
})
export class FilterModule {}
