import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-in-app-disclosure',
  templateUrl: './in-app-disclosure.component.html',
  styleUrls: ['./in-app-disclosure.component.scss']
})
export class InAppDisclosureComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  public async close() {
    await Storage.set({
      key: 'alreadyAskGeolocationPermission',
      value: JSON.stringify(true)
    });
    this.modalCtrl.dismiss();
  }
}
