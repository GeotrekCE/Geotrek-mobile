import { NgModule } from '@angular/core';
import { LowerRoundPipe } from '@app/pipes/lower-round.pipe';

@NgModule({
  imports: [],
  declarations: [LowerRoundPipe],
  exports: [LowerRoundPipe]
})
export class CustomPipesModule {}
