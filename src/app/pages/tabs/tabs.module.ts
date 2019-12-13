import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.routing.module';
import { TreksPageModule } from '../treks/treks.module';
import { MorePageModule } from '../more/more.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsPageRoutingModule,
    TreksPageModule,
    MorePageModule,
    TranslateModule.forChild(),
    SharedUiModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
