import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, updateDoc, addDoc, collection, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { getDownloadURL, getStorage } from 'firebase/storage';
import { ref, Storage } from '@angular/fire/storage';
import { User } from './user.service';

export interface Content{
  id?: string; 
  Description: string;
  Date: string;
  Image: string;
  Title: string;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Retrieves data from firebase database.
 */
export class DataService {
  constructor(private firestore : Firestore, private storage:Storage) { }

  /**
   * Retrieves home page's contents.
   * @returns observable containing array of content 
   */
  getHomeContents(): Observable<Content[]>{ 
    const ContentsReference = collection(this.firestore,'HomeContents');
    let coll= collectionData(ContentsReference, { idField :'id'}) as Observable<Content[]>;    
    const newColl= coll.pipe(
      map(contents => {
        for(let i=0;i<contents.length;i++){
          let content=contents[i];
          let pathReference=ref(this.storage,content.Image);   
          getDownloadURL(pathReference).then((url) => {content.Image=url;});          
        }
        contents.sort((content1,content2)=>{
          if(Number(content1.id)>Number(content2.id))return -1;
          if(Number(content1.id)<Number(content2.id))return 1;
          return 0;
        })
        return contents;
      })
    );
    return newColl ;
  }

  /**
   * Retrieves a user's profile from given nickname.
   * @param nickname name of the user as string
   * @returns user's profile as User, or null if the user couldnt be found
   */
  async getUser(nickname){
    const UsersReference = collection(this.firestore,'users');    
    const q= query(UsersReference, where ("Nickname","==", nickname));
    const querySnapshot = await getDocs(q);
    var retUser:User;
    if(querySnapshot.size==0){
      return null;
    }
    retUser=querySnapshot.docs[0].data() as User;
    retUser.id=querySnapshot.docs[0].id;
    return retUser;
  }

  /**
   * Retrieves all users in the platform.
   * @returns Observable containing array of User
   */
  getAllUsers(){
    const ContentsReference = collection(this.firestore,'users');
    let coll= collectionData(ContentsReference, { }) as Observable<User[]>;    
    return coll;
  }
  /**
   * Retrieves all e-mail-verified users in the platform.
   * @returns Promise containing array of User
   */
  async getAllVerifiedUsers(){
    const UsersReference = collection(this.firestore,'users');
    const q= query(UsersReference, where ("Verified","==", true));
    const querySnapshot = await getDocs(q);
    var users = new Array<User>();
    var user:User;
    querySnapshot.forEach((doc) => { 
      user= doc.data() as User;
      user.id= doc.id;
      users.push(user);        
    });
    return users;
  }
}
