import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth'
import { loggedIn } from '@angular/fire/auth-guard';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {
    this.authStatusListener();
   }
  
  async register(email, password){
    try{
      const user = await createUserWithEmailAndPassword(this.auth, email, password) ;
      if(user!==null){
        await sendEmailVerification(user.user);
      }
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

  async emailVerification(){    
    await this.auth.currentUser?.reload();
    if(this.auth.currentUser.emailVerified){
      return true;
    }else{
      sendEmailVerification(this.auth.currentUser);
      return false;
    }    
  }

  sendVerEmail(){
    sendEmailVerification(this.auth.currentUser);
  }

  refresh(){
    this.auth.currentUser.reload;
  }

  authStatusListener(){
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        console.log('User is logged in');
        return true;
      }
      else{
        console.log('User is logged out');
        return false;
        
      }
    })
  }

}
