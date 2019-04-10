import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrekVizComponent } from './map-trek-viz.component';

describe('MapTrekVizComponent', () => {
  let component: MapTrekVizComponent;
  let fixture: ComponentFixture<MapTrekVizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapTrekVizComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrekVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
