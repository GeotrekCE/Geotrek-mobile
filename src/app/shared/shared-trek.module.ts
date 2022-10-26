import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TrekCardComponent } from '@app/components/trek-card/trek-card.component';

@Pipe({ name: 'lowerRound' })
export class LowerRoundPipe implements PipeTransform {
  transform(value: number): number {
    return Math.floor(value);
  }
}
@NgModule({
  declarations: [LowerRoundPipe, TrekCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  exports: [LowerRoundPipe, TrekCardComponent]
})
export class SharedTrekModule {}
