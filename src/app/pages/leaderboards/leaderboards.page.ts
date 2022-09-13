import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.page.html',
  styleUrls: ['./leaderboards.page.scss'],
})
export class LeaderboardsPage implements OnInit {
  users = [];  
  orderType = 5; //defines the order of users in the leaderboard: 1-Nickname, 2:Number of kills, 3:Number of deaths, 4:Travel distance value, 5:xp value
  constructor(private dataService: DataService, private router:Router) { }

  ngOnInit() {
    this.loadData();    
  }

  /**
   * Retrieves all verified users in the platform and orders them based on orderType variable.
   */
  loadData(){
    from(this.dataService.getAllVerifiedUsers()).subscribe(res => {
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
            if(Number(user1.Xp)>Number(user2.Xp))return -1;
            if(Number(user1.Xp)<Number(user2.Xp))return 1;
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

  /**
   * Sets orderType variable to given number, or, if the given number is the same as orderType, reverses the list.
   * @param n 
   */
  orderBy(n:number){
    if(this.orderType==n){
      this.users.reverse();
    }else{
      this.orderType=n;
    this.loadData();
    }    
  }

}
