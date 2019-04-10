import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreItemPage } from './more-item.page';

describe('MoreItemPage', () => {
  let component: MoreItemPage;
  let fixture: ComponentFixture<MoreItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoreItemPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
