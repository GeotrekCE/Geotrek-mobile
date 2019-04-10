import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiComponent } from './poi.component';

describe('PoiComponent', () => {
  let component: PoiComponent;
  let fixture: ComponentFixture<PoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
