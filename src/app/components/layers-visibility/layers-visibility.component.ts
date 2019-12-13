import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-layers-visibility',
  templateUrl: './layers-visibility.component.html',
  styleUrls: ['./layers-visibility.component.scss']
})
export class LayersVisibilityComponent {
  changeLayerVisibility: any;
  layers: any;

  constructor(private navParams: NavParams) {}

  ionViewWillEnter() {
    this.changeLayerVisibility = this.navParams.get('changeLayerVisibility');
    this.layers = this.navParams.get('layers');
  }

  public layerVisibilityChange(event: any) {
    this.changeLayerVisibility(event.detail.checked, event.detail.value);
  }
}
