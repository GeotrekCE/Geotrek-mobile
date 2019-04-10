import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreksContextResolver } from '@app/resolvers/treks.resolver';
import { TreksPage } from '../treks/treks.page';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'treks',
        children: [
          {
            path: '',
            component: TreksPage,
            resolve: {
              context: TreksContextResolver
            }
          },
          {
            path: 'trek-details/:trekId',
            loadChildren: '../trek-details/trek-details.module#TrekDetailsPageModule',
          },
          {
            path: 'treks-map',
            loadChildren: '../treks-map/treks-map.module#TreksMapPageModule',
          },
        ],
      },
      {
        path: 'treks-offline',
        children: [
          {
            path: '',
            component: TreksPage,
            data: { offline: true },
            resolve: {
              context: TreksContextResolver
            }
          },
          {
            path: 'trek-details/:trekId',
            loadChildren: '../trek-details/trek-details.module#TrekDetailsPageModule',
            data: { offline: true },
          },
          {
            path: 'treks-map',
            loadChildren: '../treks-map/treks-map.module#TreksMapPageModule',
            data: { offline: true },
          },
        ],
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: '../more/more.module#MorePageModule',
          },
          {
            path: ':moreItemId',
            loadChildren: '../more/more-item/more-item.module#MoreItemPageModule',
          },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: '/app/tabs/treks',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
