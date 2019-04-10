import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreksPage } from './treks.page';

describe('TreksPage', () => {
  let component: TreksPage;
  let fixture: ComponentFixture<TreksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreksPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
