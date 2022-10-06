import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appName: string = environment.appName;

  constructor() {}
}
