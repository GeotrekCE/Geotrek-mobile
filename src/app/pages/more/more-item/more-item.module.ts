import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MoreItemResolver } from '@app/resolvers/more-item.resolver';
import { SharedUiModule } from '@app/shared/shared-ui.module';

import { MoreItemPage } from './more-item.page';

const routes: Routes = [
  {
    path: '',
    component: MoreItemPage,
    runGuardsAndResolvers: 'always',
    resolve: {
      item: MoreItemResolver
    }
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
  declarations: [MoreItemPage]
})
export class MoreItemPageModule {}
