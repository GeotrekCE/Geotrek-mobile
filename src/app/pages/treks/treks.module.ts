import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';
import { SharedTreksModule } from '@app/shared/shared-treks.module';
import { SharedUiModule } from '@app/shared/shared-ui.module';

import { RouterModule, Routes } from '@angular/router';
import { TreksPage } from './treks.page';

const routes: Routes = [
  {
    path: '',
    component: TreksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedTreksModule,
    SharedUiModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [TreksPage]
})
export class TreksPageModule {}
