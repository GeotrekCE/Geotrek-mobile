import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreksMapPage } from './treks-map.page';

describe('TreksMapPage', () => {
  let component: TreksMapPage;
  let fixture: ComponentFixture<TreksMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreksMapPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreksMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
