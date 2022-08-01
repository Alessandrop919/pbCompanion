import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  profile=null;
  constructor( private avatarService: AvatarService, private authService: AuthService, private router: Router, private loadingController: LoadingController, private alertController: AlertController) {}

  async logOut(){
    const loading = await this.loadingController.create();
    await loading.present();
    await this.authService.logout();  
    await loading.dismiss();  
    this.router.navigateByUrl('/',{ replaceUrl:true});
  }

  ngOnInit() {
  }

}
