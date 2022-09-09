import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginCredentials: FormGroup;
  regCredentials: FormGroup;

  segment = 'first';

  constructor(private router: Router, private fb: FormBuilder, private loadingService: LoadingService, private alertController: AlertController, private authService: AuthService, private userService: UserService) { }

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
    return this.regCredentials.get('regPassword2');
  }
  get username(){
    return this.regCredentials.get('username');
  }

  ngOnInit() {
    this.loginCredentials=this.fb.group({loginEmail: ['', [Validators.required, Validators.email]], loginPassword: ['', [Validators.required]]});
    this.regCredentials=this.fb.group({regEmail: ['', [Validators.required, Validators.email]], regPassword1: ['',[Validators.required,Validators.minLength(6)]], regPassword2:['',[Validators.required,Validators.minLength(6)]], username:['',[Validators.required,Validators.minLength(3)]]},{validator:this.validatePasswords('regPassword1','regPassword2')});
  }

  validatePasswords(regPassword1:any,regPassword2:any){
    return (formGroup : FormGroup) => {
      const password1 = formGroup.controls[regPassword1];
      const password2 = formGroup.controls[regPassword2];
      if (password2.errors && !password2.errors['mismatch']){
        return;
      }
      if ( password1.value !== password2.value){
        password2.setErrors({mismatch:true});
      }else{
        password2.setErrors(null);
      }
    }
  }

  validateUsername(username:any){
    this.userService.getAllUsers().subscribe(res => {
      for(let i=0;i<res.length;i++){
        var user=res[i];
        if(user.Nickname===username){
          return false;
        }
        return true;
      }
    })
  }

  async submitLogin(){
    await this.loadingService.present({ message: 'Checking credentials',duration: 5000 }); 
    const user = await this.authService.login(this.loginEmail.value,this.loginPassword.value);
    await this.loadingService.dismiss();
    if(user){
      if(user.user.emailVerified){
        this.router.navigateByUrl('', {replaceUrl:true});
      }else{
        this.showAlert('Account not verified', 'Redirecting to account verification.');
        this.authService.logout();
        this.router.navigateByUrl('verifyemail', {replaceUrl:true});
      }
    }else{
      this.showAlert('Login failed', 'Your credentials are invalid, try again.');
    }
  }

  async submitRegister(){
    await this.loadingService.present({ message: 'Creating account',duration: 5000 }); 
    const user = await this.authService.register(this.regEmail.value,this.regPassword1.value);    
    await this.loadingService.dismiss();
    if(user){
      await this.userService.initProfile(this.username.value);
      this.router.navigateByUrl('verifyemail', {replaceUrl:true});      
    }else{
      this.showAlert('Registration failed', 'Your email is invalid or might be already associated to an account, please try again');
    }
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }

}
