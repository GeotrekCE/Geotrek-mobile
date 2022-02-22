import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TreksMapPage } from './treks-map.page';
import { SelectTrekComponent } from '@app/components/select-trek/select-trek.component';
import { MapTreksVizComponent } from '@app/components/map-treks-viz/map-treks-viz.component';

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
    RouterModule.forChild(routes),
    SharedUiModule,
    TranslateModule.forChild()
  ],
  declarations: [TreksMapPage, SelectTrekComponent, MapTreksVizComponent],
  exports: [MapTreksVizComponent]
})
export class TreksMapPageModule {}
