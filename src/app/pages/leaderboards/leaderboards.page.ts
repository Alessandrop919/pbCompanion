import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.page.html',
  styleUrls: ['./leaderboards.page.scss'],
})
export class LeaderboardsPage implements OnInit {
  users = [];  
  orderType = 4;
  constructor(private userService: UserService, private router:Router) { }

  ngOnInit() {
    this.loadData();    
  }

  loadData(){
    this.userService.getAllUsers().subscribe(res => {
      switch(this.orderType) { 
        case 1: { 
          res.sort((user1,user2)=>{
            if(user1.Nickname>user2.Nickname)return 1;
            if(user1.Nickname<user2.Nickname)return -1;
            return 0;
          });
          break; 
        } 
        case 2: { 
          res.sort((user1,user2)=>{
            if(Number(user1.Kills)>Number(user2.Kills))return -1;
            if(Number(user1.Kills)<Number(user2.Kills))return 1;
            return 0;
          });
          break; 
        } 
        case 3: { 
          res.sort((user1,user2)=>{
            if(Number(user1.Death)>Number(user2.Death))return -1;
            if(Number(user1.Death)<Number(user2.Death))return 1;
            return 0;
          });
          break; 
        } 
        case 4: { 
          res.sort((user1,user2)=>{
            if(Number(user1.TravelDist)>Number(user2.TravelDist))return -1;
            if(Number(user1.TravelDist)<Number(user2.TravelDist))return 1;
            return 0;
          });
          break; 
        } 
        case 5: { 
          res.sort((user1,user2)=>{
            if(Number(user1.TravelDist)>Number(user2.Xp))return -1;
            if(Number(user1.TravelDist)<Number(user2.Xp))return 1;
            return 0;
          });
          break; 
        } 
        default: {           
          break; 
      } 
    } 
    this.users=res;});
  }

  orderBy(n:number){
    if(this.orderType==n){
      this.users.reverse();
    }else{
      this.orderType=n;
    this.loadData();
    }    
  }

}
