import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTreksVizComponent } from './map-treks-viz.component';

describe('MapTreksVizComponent', () => {
  let component: MapTreksVizComponent;
  let fixture: ComponentFixture<MapTreksVizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapTreksVizComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTreksVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
