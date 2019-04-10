import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PoiComponent } from '@app/components/poi/poi.component';
import { TrekCardComponent } from '@app/components/trek-card/trek-card.component';

@NgModule({
  declarations: [
    PoiComponent,
    TrekCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    PoiComponent,
    TrekCardComponent,
  ],
})
export class SharedTreksModule {
}
