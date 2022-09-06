import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {
  constructor(private authService: AuthService, private loadingService: LoadingService, private alertController: AlertController, private router:Router) {  }

  ngOnInit() {    
  }

  async sendConfirmationEmail(){
    this.authService.sendVerEmail();    
    this.showAlert('Email confirm', 'New confirmation email sent, also check your spam section.');
    this.authService.logout();
    this.router.navigateByUrl('', {replaceUrl:true});
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }
  
}
