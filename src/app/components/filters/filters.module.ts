import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { FiltersComponent } from './filters.component';
import { FilterModule } from '../filter//filter.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    FilterModule
  ],
  declarations: [FiltersComponent]
})
export class FiltersComponentModule {}
