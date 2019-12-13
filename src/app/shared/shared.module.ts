import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { GeolocateNotificationsComponent } from '@app/components/geolocate-notifications/geolocate-notifications.component';
import { MapTrekVizComponent } from '@app/components/map-trek-viz/map-trek-viz.component';
import { MapTreksVizComponent } from '@app/components/map-treks-viz/map-treks-viz.component';

import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    MapTreksVizComponent,
    MapTrekVizComponent,
    GeolocateNotificationsComponent
  ],
  imports: [CommonModule, IonicModule, TranslateModule.forChild()],
  exports: [
    MapTreksVizComponent,
    MapTrekVizComponent,
    GeolocateNotificationsComponent
  ]
})
export class SharedModule {}
