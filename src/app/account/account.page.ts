import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
    constructor( private avatarService: AvatarService, private authService: AuthService, private router: Router, private loadingController: LoadingController, private alertController: AlertController) {

    this.avatarService.getUserProfile().subscribe((data)=>{this.profile=data;});
  }

  async logOut(){
    const loading = await this.loadingController.create();
    await loading.present();
    await this.authService.logout();  
    await loading.dismiss();  
    this.router.navigateByUrl('/',{ replaceUrl:true});
  }

  async changeImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if(image){
      const loading = await this.loadingController.create();
      await loading.present();
      const result = await this.avatarService.uploadImage(image);
      loading.dismiss;
      if(!result){
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'Something went wrong during the upload of your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  ngOnInit() {
  }

}
