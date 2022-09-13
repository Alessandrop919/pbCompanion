import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})

/**
 * Manages users' authentication process and firebase's authentication related services.
 */
export class AuthService {
  constructor(private auth: Auth) {
    this.authStatusListener();
   }
  
  /**
   * Registers a user in the platform with given email and password.
   * @param email user's email
   * @param password user's password
   * @returns the created user, or null if there was an error.
   */
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

  /**
   * Authenticates an already registered user with email and password.
   * @param email user's email
   * @param password user's password
   * @returns the authenticated user, or null if there was an error.
   */
  async login(email,password){
    try{
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    }catch(e){
      return null;
    }  
  }

  /**
   * Logs current authenticated user out.
   * @returns result of logout
   */
  logout(){
    return signOut(this.auth);
  }

  /**
   * Sends email with instructions on how to reset the password to given email.
   * @param email email where to send reset instructions
   */
  forgotPassword(email : string){
    sendPasswordResetEmail(this.auth,email).then(()=> {
    }).catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  /**
   * Sends email verification to current authenticated user
   */
  sendVerEmail(){
    sendEmailVerification(this.auth.currentUser);
  }

  /**
   * Reloads current authenticated user.
   */
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

  /**
   * Returns current authenticated user's email.
   * @returns user's email as string
   */
  getEmail():String{
    return this.auth.currentUser.email;
  }
  
  /**
   * Returns current authenticated user's display name.
   * @returns user's display name as string
   */
  getName():String{
    return this.auth.currentUser.displayName;
  }

}
