import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {
  constructor(private router:Router) {  }

  ngOnInit() {    
  }

  back(){
    this.router.navigateByUrl('', {replaceUrl:true});
  }
}
