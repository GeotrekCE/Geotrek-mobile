import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MorePage } from './more.page';

describe('MorePage', () => {
  let component: MorePage;
  let fixture: ComponentFixture<MorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MorePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
