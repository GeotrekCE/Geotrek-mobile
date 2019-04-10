import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrekMapPage } from './trek-map.page';

describe('TrekMapPage', () => {
  let component: TrekMapPage;
  let fixture: ComponentFixture<TrekMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrekMapPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrekMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
