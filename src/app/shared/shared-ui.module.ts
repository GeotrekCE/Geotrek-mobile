import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapsibleListComponent } from '@app/components/collapsible-list/collapsible-list.component';
import { IonicModule } from '@ionic/angular';

import { ConnectErrorComponent } from '@app/components/connect-error/connect-error.component';
import { LoaderComponent } from '@app/components/loader/loader.component';

@NgModule({
  declarations: [CollapsibleListComponent, ConnectErrorComponent, LoaderComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [CollapsibleListComponent, ConnectErrorComponent, LoaderComponent],
})
export class SharedUiModule {}
