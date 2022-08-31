import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
  export class AccountPage implements OnInit {

    profile=null;
    constructor( private avatarService: AvatarService, private authService: AuthService, private router: Router, private alertController: AlertController, private loadingService:LoadingService) {

    this.avatarService.getUserProfile().subscribe((data)=>{this.profile=data;});
  }

  async logOut(){
    await this.loadingService.present({ message: 'Logging out',duration: 5000 }); 
    await this.authService.logout();  
    await this.loadingService.dismiss();
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
      await this.loadingService.present({ message: 'Loading image',duration: 5000 });      
      const result = await this.avatarService.uploadImage(image);
      await this.loadingService.dismiss();
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
