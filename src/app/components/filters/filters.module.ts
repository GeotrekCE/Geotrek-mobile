import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';
import { SharedFiltersModule } from '@app/shared/shared-filters.module';

@NgModule({
  imports: [CommonModule, IonicModule, SharedFiltersModule, TranslateModule.forChild()],
})
export class FiltersComponentModule {}
