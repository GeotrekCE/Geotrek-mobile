import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss']
})
export class EmergencyPage implements OnInit {
  public appName: string = environment.appName;
  public menuNavigation: boolean = !(environment.navigation === 'tabs');
  public emergencyNumber = environment.emergencyNumber;
  public currentPosition: {
    longitude: number;
    latitude: number;
  } | null = null;

  constructor(private geolocate: GeolocateService) {}

  ngOnInit() {}

  async getLocation() {
    this.currentPosition = await this.geolocate.getCurrentPosition();
  }
}
