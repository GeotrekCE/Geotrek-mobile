import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-in-app-disclosure',
  templateUrl: './in-app-disclosure.component.html',
  styleUrls: ['./in-app-disclosure.component.scss']
})
export class InAppDisclosureComponent implements OnInit {
  constructor(private modalCtrl: ModalController, public storage: Storage) {}

  ngOnInit() {}

  public async close() {
    await this.storage.set(
      'alreadyAskGeolocationPermission',
      JSON.stringify(true)
    );
    this.modalCtrl.dismiss();
  }
}
