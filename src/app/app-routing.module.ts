import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'app',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
  },
  {
    path: 'app/map/:trekId',
    loadChildren: './pages/trek-map/trek-map.module#TrekMapPageModule',
  },
  {
    path: 'app/map/:trekId/:stageId',
    loadChildren: './pages/trek-map/trek-map.module#TrekMapPageModule',
    data: { isStage: true },
  },
  {
    path: 'app/map-offline/:trekId',
    loadChildren: './pages/trek-map/trek-map.module#TrekMapPageModule',
    data: { offline: true },
  },
  {
    path: 'app/map-offline/:trekId/:stageId',
    loadChildren: './pages/trek-map/trek-map.module#TrekMapPageModule',
    data: { offline: true, isStage: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
