import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationDeskDetailsComponent } from './information-desk-details.component';

describe('InformationDeskDetailsComponent', () => {
  let component: InformationDeskDetailsComponent;
  let fixture: ComponentFixture<InformationDeskDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationDeskDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationDeskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
