import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  friends;
  friendInfo:FormGroup;

  constructor(private loadingService:LoadingService, private alertController:AlertController, private fb:FormBuilder, private friendService: FriendService) { 
    this.friendInfo=this.fb.group({username: ['', [Validators.required, Validators.minLength(3)]]});   
  }

  ngOnInit() {
    this.loadFriends();
  }

  get username(){
    return this.friendInfo.get('username');
  }  

  /**
   * Retrieves user's friendlist from friend service.
   */
  async loadFriends(){    
    this.friends=await this.friendService.getFriendList();
  }

  /**
   * Removes passed friend from friend list.
   * @param friend friend to be removed from frend list.
   */
  async removeFriend(friend){
    await this.loadingService.present({ message: 'Deleting friend',duration: 5000 }); 
    await this.friendService.deleteFriend(friend);
    await this.loadingService.dismiss();
    await this.loadFriends();
  }

  /**
   * Adds new friend to user's friendlist, based on the usename inside form.
   */
  async addFriend(){
    await this.loadingService.present({ message: 'Adding friend',duration: 5000 });       
    await this.loadingService.dismiss();
    if(!await this.friendService.addFriend(this.friendInfo.get('username').value)){
      this.showAlert("Error","User not found");
    }
    await this.loadFriends();

    await this.loadFriends();
  }

  chat(friend){
    this.showAlert("Attention","Chat service is not available at the moment.");
  }

  async showAlert(header, message){
    const alert = await this.alertController.create({header,message,buttons: ['OK']});
    await alert.present();
  }
}
