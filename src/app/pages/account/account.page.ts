import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

  export class AccountPage implements OnInit {
    profile=null;
    constructor( private userService: UserService, private authService: AuthService, private router: Router, private alertController: AlertController, private loadingService:LoadingService) {
    this.userService.getUserProfile().subscribe((data)=>{this.profile=data;});
  }

  ngOnInit() {
  }

  /**
   * Forwards log out request to authentication service.
   */
  async logOut(){
    await this.loadingService.present({ message: 'Logging out',duration: 5000 }); 
    this.router.navigateByUrl('/',{ replaceUrl:true});
    await this.authService.logout();  
    await this.loadingService.dismiss();    
  }

  /**
   * Allows user to select new image to set as profile picture and forwards request to user service.
   */
  async changeImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if(image){
      await this.loadingService.present({ message: 'Loading image',duration: 5000 });      
      const result = await this.userService.uploadImage(image);
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

  /**
   * Retrieves current authenticated user's profile email.
   * @returns email as string
   */
  getEmail(){
    return this.authService.getEmail();
  }

  /**
   * Retrieves current authenticated user's profile name.
   * @returns user's name as string
   */
  getName(){
    var name = this.authService.getName();
    if(name === null){
      return "Not set";      
    }else{      
      return name;
    }
  }
    

}
