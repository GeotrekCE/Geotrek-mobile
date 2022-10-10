import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ConnectErrorComponent } from '@app/components/connect-error/connect-error.component';

@NgModule({
  declarations: [ConnectErrorComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [ConnectErrorComponent]
})
export class SharedUiModule {}
