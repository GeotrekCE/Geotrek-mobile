import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
            component: TreksPage
          }
        ]
      },
      {
        path: 'treks-offline',
        children: [
          {
            path: '',
            component: TreksPage,
            data: { offline: true }
          }
        ]
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../more/more.module').then((m) => m.MorePageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/treks',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
