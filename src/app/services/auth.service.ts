import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendSignInLinkToEmail } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }
  
  async register(email, password){
    try{
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      this.sendEmailVerification();      
      return user;
    }catch(e){
      return null;
    }    
  }

  async login(email,password){
    try{
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    }catch(e){
      return null;
    }  
  }

  logout(){
    return signOut(this.auth);
  }

  forgotPassword(email : string){
    sendPasswordResetEmail(this.auth,email).then(()=> {
    }).catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  sendEmailVerification(){
    const actionCodeSettings = {  
      url: 'http://localhost:8100/',
      handleCodeInApp: true,
      iOS: {
        bundleId: ''
      },
      android: {
        packageName: '',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'http://localhost:8100/'
    };
    console.log(this.auth.currentUser.email);
    var user = this.auth.currentUser;
    if(user){
      //sendSignInLinkToEmail(this.auth,user.email,actionCodeSettings);
    }
  }


}
