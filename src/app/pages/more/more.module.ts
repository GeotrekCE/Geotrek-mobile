import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoreResolver } from '@app/resolvers/more.resolver';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MorePage } from './more.page';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    component: MorePage,
    resolve: {
      items: MoreResolver
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
  declarations: [MorePage]
})
export class MorePageModule {}
