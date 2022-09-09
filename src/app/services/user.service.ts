import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, collection, collectionData } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, uploadString } from 'firebase/storage';
import { Observable } from 'rxjs';

export interface User{
  id: string;
  Kills: number;
  Death: number;
  TravelDist: number;
  Xp: number;
  imageUrl: string;
  Nickname: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) { }
  

  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocReference = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocReference, {idField:'id'});
  }

  initProfile(username:string){
    const user = this.auth.currentUser;
    const defaultImageUrl="https://firebasestorage.googleapis.com/v0/b/pbcompanion.appspot.com/o/uploads%2FaM3ECTh0wDZlu8FHA5LjZoZUAak1%2Fprofile.png?alt=media&token=9ec5d0d2-6902-4095-9869-fcefb0a9c95e";
    try{      
      const userDocReference = doc(this.firestore,`users/${user.uid}`);
      let FriendList= new Array<string>();
       setDoc(userDocReference,{imageUrl:defaultImageUrl, Death:"0", Kills:"0", FriendList, TravelDist: "0", Xp: "0", Nickname:username});
      return true;
    } catch(e){
        return null;
    }
  }
  
  async uploadImage(cameraFIle:Photo){
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageReference = ref(this.storage,path);
    try{      
      await uploadString(storageReference, cameraFIle.base64String,'base64');
      const imageUrl = await getDownloadURL(storageReference);
      const userDocReference = doc(this.firestore,`users/${user.uid}`);
      await setDoc(userDocReference,{imageUrl,});
      return true;
    } catch(e){
        return null;
    }
  }

  getAllUsers(){
    const ContentsReference = collection(this.firestore,'users');
    let coll= collectionData(ContentsReference, { }) as Observable<User[]>;    
    return coll;
  }

  async getFriendList(){
    const UsersReference = collection(this.firestore,'users');    
    const q= query(UsersReference, where ("FriendList","array-contains", this.auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
});
      
  }

  
}


