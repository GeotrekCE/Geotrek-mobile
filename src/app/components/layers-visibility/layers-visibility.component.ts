import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-layers-visibility',
  templateUrl: './layers-visibility.component.html',
  styleUrls: ['./layers-visibility.component.scss']
})
export class LayersVisibilityComponent implements OnInit {
  changeLayerVisibility: any;
  layers: any;

  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.changeLayerVisibility = this.navParams.get('changeLayerVisibility');
    this.layers = this.navParams.get('layers');
  }

  public layerVisibilityChange(event: any) {
    this.changeLayerVisibility(event.detail.checked, event.detail.value);
  }
}
