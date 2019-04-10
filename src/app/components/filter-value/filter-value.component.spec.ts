import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterValueComponent } from './filter-value.component';

describe('FilterValueComponent', () => {
  let component: FilterValueComponent;
  let fixture: ComponentFixture<FilterValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
