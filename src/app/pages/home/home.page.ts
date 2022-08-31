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
    this.dataService.getContents().subscribe(res => {console.log(res); this.contents=res}); 
  }

  async openContent(content) {
    /*
    const modal = await this.modalCtrl.create({ component: ModalPage, componentProps:{ id: content.id}, breakpoints: [0, 0.5, 0.8], initialBreakpoint:0.5 });
    modal.present();
    */
  }

  addContent() {
    //not needed for now, only seen by admin
  }
}