import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TreksMapPage } from './treks-map.page';
import { MapTreksVizComponent } from '@app/components/map-treks-viz/map-treks-viz.component';
import { SharedTreksModule } from '@app/shared/shared-treks.module';

const routes: Routes = [
  {
    path: '',
    component: TreksMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedTreksModule,
    RouterModule.forChild(routes),
    SharedUiModule,
    TranslateModule.forChild()
  ],
  declarations: [TreksMapPage, MapTreksVizComponent],
  exports: [MapTreksVizComponent]
})
export class TreksMapPageModule {}
