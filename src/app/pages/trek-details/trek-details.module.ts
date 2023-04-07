import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TrekDetailsPage } from './trek-details.page';
import { PoiComponent } from '@app/components/poi/poi.component';
import { InformationDeskComponent } from '@app/components/information-desk/information-desk.component';

import { SharedTrekModule } from '@app/shared/shared-trek.module';

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
    SharedTrekModule,
    SharedUiModule,
    TranslateModule.forChild()
  ],
  declarations: [TrekDetailsPage, PoiComponent, InformationDeskComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrekDetailsPageModule {}
