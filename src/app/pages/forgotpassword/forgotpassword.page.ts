import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  resetEmail : FormGroup;
  constructor(private authService: AuthService, private fb:FormBuilder, private loadingService: LoadingService, private alertController: AlertController) {
    this.resetEmail = this.fb.group({email:['',[Validators.required, Validators.email]]});
  }

  ngOnInit() {
  }

  async submit(){
    await this.loadingService.present({ message: 'Checking email',duration: 5000 }); 
    this.authService.forgotPassword(this.resetEmail.get('email').value);
    await this.loadingService.dismiss();
    this.showAlert('Reset procedure', 'If your email is correct, you will receive the instructions to proceed with password reset.');    
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }
}
