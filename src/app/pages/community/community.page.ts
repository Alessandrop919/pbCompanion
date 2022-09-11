import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  profile=null;
  friends;
  friendInfo:FormGroup;

  constructor(private userService: UserService, private loadingService:LoadingService, private alertController:AlertController, private fb:FormBuilder) { 
    this.friendInfo=this.fb.group({username: ['', [Validators.required, Validators.minLength(3)]]});    
    this.userService.getUserProfile().subscribe((data)=>{
      this.profile=data;
    });
  }

  get username(){
    return this.friendInfo.get('username');
  }

  ngOnInit() {
    this.loadFriends();
  }

  async loadFriends(){    
    this.friends=await this.userService.getFriendList();
  }

  async removeFriend(friend){
    await this.loadingService.present({ message: 'Deleting friend',duration: 5000 }); 
    await this.userService.deleteFriend(friend);
    await this.loadingService.dismiss();
    await this.loadFriends();
  }

  async addFriend(){
    await this.loadingService.present({ message: 'Adding friend',duration: 5000 });       
    await this.loadingService.dismiss();
    if(!await this.userService.addFriend(this.friendInfo.get('username').value)){
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
