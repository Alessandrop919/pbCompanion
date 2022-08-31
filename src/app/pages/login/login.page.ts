import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private loadingService: LoadingService, private alertController: AlertController, private authService: AuthService) { }

  get email(){
    return this.credentials.get('email');
  }

  get password(){
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials=this.fb.group({email: ['', [Validators.required, Validators.email]], password: ['',[Validators.required,Validators.minLength(5)]],});
  }

  async logIn(){
    await this.loadingService.present({ message: 'Checking credentials',duration: 5000 }); 
    const user = await this.authService.login(this.credentials.value);
    await this.loadingService.dismiss();
    if(user){
      this.router.navigateByUrl('', {replaceUrl:true});
    }else{
      this.showAlert('Login failed', 'Your credentials are invalid, try again.');
    }
  }

  async register(){
    await this.loadingService.present({ message: 'Creating account',duration: 5000 }); 
    const user = await this.authService.register(this.credentials.value);
    await this.loadingService.dismiss();
    if(user){
      this.router.navigateByUrl('', {replaceUrl:true});
    }else{
      this.showAlert('Registration failed', 'Please try again');
    }
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }

}
