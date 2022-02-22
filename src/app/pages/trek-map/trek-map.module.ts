import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrekMapPage } from './trek-map.page';
import { GeolocateNotificationsComponent } from '@app/components/geolocate-notifications/geolocate-notifications.component';
import { MapTrekVizComponent } from '@app/components/map-trek-viz/map-trek-viz.component';

const routes: Routes = [
  {
    path: '',
    component: TrekMapPage
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
  declarations: [
    TrekMapPage,
    GeolocateNotificationsComponent,
    MapTrekVizComponent
  ],
  exports: [GeolocateNotificationsComponent, MapTrekVizComponent]
})
export class TrekMapPageModule {}
