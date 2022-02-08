import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { SelectPoiComponent } from './select-poi.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule.forChild()],
  declarations: [SelectPoiComponent]
})
export class SelectPoiModule {}
