import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { SearchComponent } from './search.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule.forChild()],
  declarations: [SearchComponent]
})
export class SearchModule {}
