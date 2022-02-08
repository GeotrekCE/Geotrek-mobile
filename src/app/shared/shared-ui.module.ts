import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapsibleListComponent } from '@app/components/collapsible-list/collapsible-list.component';
import { IonicModule } from '@ionic/angular';

import { ConnectErrorComponent } from '@app/components/connect-error/connect-error.component';

@NgModule({
  declarations: [CollapsibleListComponent, ConnectErrorComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [CollapsibleListComponent, ConnectErrorComponent]
})
export class SharedUiModule {}
