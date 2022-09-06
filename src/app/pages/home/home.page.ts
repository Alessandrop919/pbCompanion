import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contents = [];
  constructor(private dataService : DataService, private alertCtrl: AlertController, private modalCtrl: ModalController){
    this.dataService.getContents().subscribe(res => this.contents=res); 
  }
}