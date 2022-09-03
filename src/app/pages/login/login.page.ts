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
  loginCredentials: FormGroup;
  regCredentials: FormGroup;

  segment = 'first';

  constructor(private router: Router, private fb: FormBuilder, private loadingService: LoadingService, private alertController: AlertController, private authService: AuthService) { }

  get loginEmail(){
    return this.loginCredentials.get('loginEmail');
  }
  get loginPassword(){
    return this.loginCredentials.get('loginPassword');
  }
  get regEmail(){
    return this.regCredentials.get('regEmail');
  }
  get regPassword1(){
    return this.regCredentials.get('regPassword1');
  }
  get regPassword2(){
    return this.regCredentials.get('regPassword1');
  }

  ngOnInit() {
    this.loginCredentials=this.fb.group({loginEmail: ['', [Validators.required, Validators.email]], loginPassword: ['', [Validators.required]]});
    this.regCredentials=this.fb.group({regEmail: ['', [Validators.required, Validators.email]], regPassword1: ['',[Validators.required,Validators.minLength(6)]], regPassword2:['',[Validators.required,Validators.minLength(6)]]},{validator:this.checkPasswords});
  }

  checkPasswords(group:FormGroup){
    let password1 = group.controls.regPassword1.value;
    let password2 = group.controls.regPassword2.value;
    return password1 === password2 ? null : { notSame:true }
  }

  async submitLogin(){
    await this.loadingService.present({ message: 'Checking credentials',duration: 5000 }); 
    const user = await this.authService.login(this.loginEmail.value,this.loginPassword.value);
    await this.loadingService.dismiss();
    if(user){
      this.router.navigateByUrl('', {replaceUrl:true});
    }else{
      this.showAlert('Login failed', 'Your credentials are invalid, try again.');
    }
  }

  async submitRegister(){
    await this.loadingService.present({ message: 'Creating account',duration: 5000 }); 
    const user = await this.authService.register(this.regEmail.value,this.regPassword1.value);
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
