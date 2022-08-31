import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule),
        ...canActivate(redirectLoggedInToHome),
      },
      {
        path: '',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
        //...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'account',
        loadChildren: () => import('../account/account.module').then( m => m.AccountPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'community',
        loadChildren: () => import('../community/community.module').then( m => m.CommunityPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'leaderboards',
        loadChildren: () => import('../leaderboards/leaderboards.module').then( m => m.LeaderboardsPageModule),
        //...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'shop',
        loadChildren: () => import('../shop/shop.module').then( m => m.ShopPageModule),
        //...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
