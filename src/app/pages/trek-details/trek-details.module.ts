import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedTreksModule } from '@app/shared/shared-treks.module';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TrekDetailsPage } from './trek-details.page';
import { PoiComponent } from '@app/components/poi/poi.component';

const routes: Routes = [
  {
    path: '',
    component: TrekDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedTreksModule,
    SharedUiModule,
    TranslateModule.forChild()
  ],
  declarations: [TrekDetailsPage, PoiComponent]
})
export class TrekDetailsPageModule {}
