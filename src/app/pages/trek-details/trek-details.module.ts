import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrekContextResolver } from '@app/resolvers/trek.resolver';
import { SharedTreksModule } from '@app/shared/shared-treks.module';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TrekDetailsPage } from './trek-details.page';
import { CustomPipesModule } from '@app/shared/custom-pipes.module';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    resolve: {
      context: TrekContextResolver
    },
    component: TrekDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedTreksModule,
    SharedUiModule,
    TranslateModule.forChild(),
    CustomPipesModule
  ],
  declarations: [TrekDetailsPage]
})
export class TrekDetailsPageModule {}
