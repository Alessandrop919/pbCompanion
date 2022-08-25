import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  constructor(private auth: Auth,private firestore: Firestore, private storage: Storage) { }
  

  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocReference = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocReference, {idField:'id'});
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
}


