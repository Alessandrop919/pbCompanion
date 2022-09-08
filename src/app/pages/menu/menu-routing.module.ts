import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
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
      },
      {
        path: 'shop',
        loadChildren: () => import('../shop/shop.module').then( m => m.ShopPageModule),
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule),
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then( m => m.AboutPageModule),
      },
      {
        path: 'resetpassword',
        loadChildren: () => import('../resetpassword/resetpassword.module').then( m => m.ResetpasswordPageModule),
      },
      {
        path: 'verifyemail',
        loadChildren: () => import('../verifyemail/verifyemail.module').then( m => m.VerifyemailPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      }      
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
