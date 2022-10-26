import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FiltersComponent } from '@app/components/filters/filters.component';
import { FilterComponent } from '@app/components/filter/filter.component';
import { FilterValueComponent } from '@app/components/filter-value/filter-value.component';
import { SearchComponent } from '@app/components/search/search.component';

@NgModule({
  declarations: [
    FiltersComponent,
    FilterComponent,
    FilterValueComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  exports: [FiltersComponent, SearchComponent]
})
export class SharedTreksModule {}
