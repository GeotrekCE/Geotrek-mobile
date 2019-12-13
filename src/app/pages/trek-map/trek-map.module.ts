import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TrekContextResolver } from '@app/resolvers/trek.resolver';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@app/shared/shared.module';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrekMapPage } from './trek-map.page';
import { SelectPoiComponent } from '@app/components/select-poi/select-poi.component';

const routes: Routes = [
  {
    path: '',
    component: TrekMapPage,
    runGuardsAndResolvers: 'always',
    resolve: {
      context: TrekContextResolver
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
  declarations: [TrekMapPage, SelectPoiComponent]
})
export class TrekMapPageModule {}
