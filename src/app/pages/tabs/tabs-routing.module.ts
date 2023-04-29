import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'instant-transfer',
        canActivate: [AuthGuard],
        loadChildren: () => import('../instant-transfer/instant-transfer.module').then(m => m.InstantTransferPageModule)
      },
      {
        path: 'card',
        canActivate: [AuthGuard],
        loadChildren: () => import('../card/card.module').then(m => m.CardPageModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
