import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { InAppDisclosureComponent } from './in-app-disclosure.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule.forChild()],
  declarations: [InAppDisclosureComponent]
})
export class InAppDisclosureModule {}
