import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' ;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service'
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginCredentials: FormGroup;
  regCredentials: FormGroup;
  segment = 'first';

  constructor(private router: Router, private fb: FormBuilder, private loadingService: LoadingService, private alertController: AlertController, private authService: AuthService, private userService: UserService, private dataService: DataService) { }

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

  /**
   * Custom formGroup validator to check wheter password and confirm password are the same.
   * @param regPassword1 name of first password in the form control
   * @param regPassword2 name of second password in the form control
   */
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

  /**
   * Checks if username is already taken by another user.
   * @param username username as string
   * @returns true if there is already a user with such username, false otherwise
   */
  async doesUserExist(username){
    if(await this.dataService.getUser(username)!==null){
      return true; 
    }else{
      return false;  
    }
  }

  /**
   * Forwards login credentials to the authservice to perform authentication.
   */
  async submitLogin(){
    await this.loadingService.present({ message: 'Checking credentials',duration: 5000 }); 
    const user = await this.authService.login(this.loginEmail.value,this.loginPassword.value);
    await this.loadingService.dismiss();
    if(user){
      if(user.user.emailVerified){
        this.router.navigateByUrl('', {replaceUrl:true});
        await this.userService.setVerified();
      }else{
        this.showAlert('Account not verified', 'Redirecting to account verification.');
        this.authService.logout();
        this.router.navigateByUrl('verifyemail', {replaceUrl:true});
      }
    }else{
      this.showAlert('Login failed', 'Your credentials are invalid, try again.');
    }
  }

  /**
   * Forwards register credentials to the authservice to perform account registration.
   */
  async submitRegister(){
    await this.loadingService.present({ message: 'Creating account',duration: 5000 }); 
    await this.loadingService.dismiss();
    if(await this.doesUserExist(this.username.value)){
      this.showAlert('Registration failed', 'The chosen username is already used.');
    }else{
      await this.loadingService.present({ message: 'Creating account',duration: 5000 }); 
      const user = await this.authService.register(this.regEmail.value,this.regPassword1.value);    
      await this.loadingService.dismiss();
      if(user){
        console.log("arrivo ad init");
        await this.userService.initProfile(this.username.value);
        this.authService.logout();
        this.router.navigateByUrl('verifyemail', {replaceUrl:true});      
      }else{
        this.showAlert('Registration failed', 'Your email is invalid or might be already associated to an account, please try again');
      }
    }    
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }

}
