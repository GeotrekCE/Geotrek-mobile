import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-trek',
  templateUrl: './select-trek.component.html',
  styleUrls: ['./select-trek.component.scss']
})
export class SelectTrekComponent implements OnInit {
  @Input() public radioTreks: {
    id: number;
    name: string;
    imgPractice: { src: string; color: string | undefined };
  }[];
  selectedTrekId: number;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.selectedTrekId = this.radioTreks[0].id;
  }

  public cancel(): void {
    this.modalController.dismiss();
  }

  public select(): void {
    this.modalController.dismiss({ selectedTrekId: this.selectedTrekId });
  }

  public selectedTrekChange(evt: any): void {
    this.selectedTrekId = evt.detail.value;
  }
}
