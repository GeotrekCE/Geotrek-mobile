import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FiltersComponent } from '@app/components/filters/filters.component';
import { FilterComponent } from '@app/components/filter/filter.component';
import { FilterValueComponent } from '@app/components/filter-value/filter-value.component';
import { SelectFilterComponent } from '@app/components/select-filter/select-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '@app/components/search/search.component';

@NgModule({
  declarations: [
    FiltersComponent,
    FilterComponent,
    FilterValueComponent,
    SelectFilterComponent,
    SearchComponent
  ],
  imports: [CommonModule, TranslateModule.forChild()],
  entryComponents: [FiltersComponent, SelectFilterComponent],
  exports: [
    FiltersComponent,
    FilterComponent,
    FilterValueComponent,
    SelectFilterComponent,
    SearchComponent
  ]
})
export class SharedFiltersModule {}
