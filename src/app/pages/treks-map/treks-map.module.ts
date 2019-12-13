import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreksContextResolver } from '@app/resolvers/treks.resolver';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TreksMapPage } from './treks-map.page';
import { SelectTrekComponent } from '@app/components/select-trek/select-trek.component';

const routes: Routes = [
  {
    path: '',
    component: TreksMapPage,
    resolve: {
      context: TreksContextResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    SharedUiModule,
    TranslateModule.forChild()
  ],
  declarations: [TreksMapPage, SelectTrekComponent]
})
export class TreksMapPageModule {}
