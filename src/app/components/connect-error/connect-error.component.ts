import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-connect-error',
  templateUrl: './connect-error.component.html',
  styleUrls: ['./connect-error.component.scss'],
})
export class ConnectErrorComponent  {
  @Input() public title = '';
  @Input() public content = '';
  @Input() public icon = '';
  @Input() public buttonText = '';
  @Output() public retry = new EventEmitter<void>();

  constructor() {}


}
