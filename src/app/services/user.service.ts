import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from 'firebase/storage';
import { DataService } from './data.service';

export interface User{
  id: string;
  Kills: number;
  Death: number;
  TravelDist: number;
  Xp: number;
  FriendList: string[];
  imageUrl: string;
  Nickname: string;
  Verified: boolean;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Retrieves, initializes and manages authenticated user's profile data from and to the database.
 */
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage, private dataService: DataService) { }
  
  /**
   * Gets current user profile and its fields from database.
   * @returns user 
   */
  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocReference = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocReference, {idField:'id'});
  }

  /**
   * Initializes users's data in the database.
   * @param username user's username
   * @returns null if there is an error
   */
  async initProfile(username:string){
    const user = this.auth.currentUser;
    const defaultImageUrl="https://firebasestorage.googleapis.com/v0/b/pbcompanion.appspot.com/o/uploads%2FaM3ECTh0wDZlu8FHA5LjZoZUAak1%2Fprofile.png?alt=media&token=9ec5d0d2-6902-4095-9869-fcefb0a9c95e";
    try{      
      const userDocReference = doc(this.firestore,`users/${user.uid}`);
      let FriendList:string[]=null;
      await setDoc(userDocReference,{imageUrl:defaultImageUrl, Death:"0", Kills:"0", FriendList:FriendList, TravelDist: "0", Xp: "0", Nickname:username, Verified: false});
    } catch(e){
        return null;
    }
  }

  /**
   * Sets verified field in the database as true 
   * @returns null if there is an error
   */
  async setVerified(){
    const user = this.auth.currentUser;
    try{      
      const userDocReference = doc(this.firestore,`users/${user.uid}`);
      let FriendList:string[]=null;
      await updateDoc(userDocReference,{Verified: true});
    } catch(e){
        return null;
    }
  }
  
  /**
   * Uploads selected photo to database and sets it as user image profile
   * @param cameraFIle photo selected
   * @returns 
   */
  async uploadImage(cameraFIle:Photo){
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageReference = ref(this.storage,path);
    try{      
      await uploadString(storageReference, cameraFIle.base64String,'base64');
      const imageUrl = await getDownloadURL(storageReference);
      const userDocReference = doc(this.firestore,`users/${user.uid}`);
      await updateDoc(userDocReference,{imageUrl:imageUrl});
    } catch(e){
        return null;
    }
  }
}