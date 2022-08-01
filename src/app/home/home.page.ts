import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  profile=null;
  constructor( private avatarService: AvatarService, private authService: AuthService, private Router: Router, private loadingController: LoadingController, private alertController: AlertController) {}

  async logout(){
    await this.authService.logout();
    this.Router.navigateByUrl('/',{ replaceUrl:true});
  }
}
