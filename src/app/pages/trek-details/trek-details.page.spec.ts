import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrekDetailsPage } from './trek-details.page';

describe('TrekDetailsPage', () => {
  let component: TrekDetailsPage;
  let fixture: ComponentFixture<TrekDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrekDetailsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrekDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
