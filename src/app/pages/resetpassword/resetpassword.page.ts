import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
  resetEmail : FormGroup;
  constructor(private authService: AuthService, private fb:FormBuilder, private loadingService: LoadingService, private alertController: AlertController) {
    this.resetEmail = this.fb.group({email:['',[Validators.required, Validators.email]]});
  }

  ngOnInit() {
  }

  /**
   * Forwards reset request to the authentication service.
   */
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
