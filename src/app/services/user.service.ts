import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, collection, collectionData } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { arrayRemove, arrayUnion, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, uploadString } from 'firebase/storage';
import { Observable } from 'rxjs';

export interface User{
  id: string;
  Kills: number;
  Death: number;
  TravelDist: number;
  Xp: number;
  FriendList: string[];
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
      let FriendList:string[]=null;
      setDoc(userDocReference,{imageUrl:defaultImageUrl, Death:"0", Kills:"0", FriendList:FriendList, TravelDist: "0", Xp: "0", Nickname:username});
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
      await updateDoc(userDocReference,{imageUrl:imageUrl});
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
    var friends = new Array<User>();
    var user:User;
    querySnapshot.forEach((doc) => { 
      user= doc.data() as User;
      user.id= doc.id;
      friends.push(user);        
    });
    return friends;
  }

  getUsersIds(users){
    var usersIds=new Array<string>();
    for(var i=0;i<users.length;i++){
      var user=users[i];
      usersIds.push(user.uid);
    }
    return usersIds;
  }

  deleteFriend(friend){    
    let newFriendList=new Array<string>();
    let newUserList=new Array<string>();
    this.getUserProfile().subscribe(res=>{
    const userDocReference = doc(this.firestore,`users/${res.id}`);
    const friendDocReference = doc(this.firestore,`users/${friend.id}`);
    updateDoc(userDocReference,{FriendList: arrayRemove(friend.id)});
    updateDoc(friendDocReference,{FriendList:arrayRemove(res.id)});
    });
    return true;
  } 

  async addFriend(friendName){
    let friendUser:User;
    friendUser=await this.getUser(friendName);
    if(friendUser!==null){
      this.getUserProfile().subscribe((res)=>{ 
      if(res.FriendList!==null){
        for (let index = 0; index < res.FriendList.length; index++) {
        let tempId = res.FriendList[index];
        if(tempId===friendUser.id){
          return false;
        }        
      } 
    }
                    
      const userDocReference = doc(this.firestore,`users/${res.id}`);
      const friendDocReference = doc(this.firestore,`users/${friendUser.id}`);
      updateDoc(userDocReference,{FriendList: arrayUnion(friendUser.id) });
      updateDoc(friendDocReference,{FriendList: arrayUnion(res.id)});      
      });
      return true;
    } else{
      return false; 
    }  
    
  }

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
}