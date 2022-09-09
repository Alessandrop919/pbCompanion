import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  profile=null;
  friends:string[];
  constructor(private userService: UserService) { 
    this.userService.getUserProfile().subscribe((data)=>{
      this.profile=data;
      this.friends=this.profile.FriendList;
    });
  }

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends(){
    this.userService.getFriendList();
  }

}
