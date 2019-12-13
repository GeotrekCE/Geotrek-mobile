import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';
import { SharedTreksModule } from '@app/shared/shared-treks.module';
import { SharedUiModule } from '@app/shared/shared-ui.module';

import { FiltersComponentModule } from '@app/components/filters/filters.module';

import { RouterModule } from '@angular/router';
import { TreksPage } from './treks.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedTreksModule,
    SharedUiModule,
    FiltersComponentModule,
    RouterModule.forChild([]),
    TranslateModule.forChild()
  ],
  declarations: [TreksPage]
})
export class TreksPageModule {}
