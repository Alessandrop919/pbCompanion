import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuItems = [{
    title: 'Home',
    icon: 'planet',
    path: ''
  },
  {
    title: 'Leaderboards',
    icon: 'medal',
    path: '/leaderboards'
  },
  {
    title: 'Community',
    icon: 'earth',
    path: '/community'
  },
  {
    title: 'Account',
    icon: 'person',
    path: '/account'
  }
  ]

  constructor(private menuController: MenuController) { }

  ngOnInit() {
  }

  setTitle(title){

  }

}
