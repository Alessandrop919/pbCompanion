import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { arrayRemove, arrayUnion, collection, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { User, UserService } from './user.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Retrieves, initializes and manages friend lists of users.
 */
export class FriendService {
  constructor(private firestore: Firestore, private auth:Auth, private userService: UserService, private dataService: DataService) { }

  /**
   * Retrieves from the database the authenticated user's list of friends.
   * @returns Array of friends
   */
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

  /**
   * Deletes the passed friend from authenticated user's friend list.
   * @param friend friend to be deleted
   * @returns 
   */
  deleteFriend(friend){    
    let newFriendList=new Array<string>();
    let newUserList=new Array<string>();
    this.userService.getUserProfile().subscribe(res=>{
    const userDocReference = doc(this.firestore,`users/${res.id}`);
    const friendDocReference = doc(this.firestore,`users/${friend.id}`);
    updateDoc(userDocReference,{FriendList: arrayRemove(friend.id)});
    updateDoc(friendDocReference,{FriendList:arrayRemove(res.id)});
    });
  } 

  /**
   * Adds a user to authenticated user's friendlist, if it exists.
   * @param friendName name of the user to add as a friend.
   * @returns true if friend is added, false if friend cannot be added.
   */
  async addFriend(friendName){
    let friendUser:User;
    friendUser=await this.dataService.getUser(friendName);
    if(friendUser!==null && friendUser.Verified){
      this.userService.getUserProfile().subscribe((res)=>{ 
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
}
