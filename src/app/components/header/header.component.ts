import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) {}

  goToAccount(){
    this.router.navigateByUrl('/account',{ replaceUrl:true});
  }

  goToHome(){
    this.router.navigateByUrl('/home',{ replaceUrl:true});
  }

  ngOnInit() {}

}
