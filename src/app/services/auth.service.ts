import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth'

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

  sendVerEmail(){
    sendEmailVerification(this.auth.currentUser);
  }

  refresh(){
    this.auth.currentUser.reload;
  }

  authStatusListener(){
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        return true;
      }else{
        return false;        
      }
    })
  }

  getEmail():String{
    return this.auth.currentUser.email;
  }

  getName():String{
    return this.auth.currentUser.displayName;
  }

}
