import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocateNotificationsComponent } from './geolocate-notifications.component';

describe('GeolocateNotificationsComponent', () => {
  let component: GeolocateNotificationsComponent;
  let fixture: ComponentFixture<GeolocateNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeolocateNotificationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocateNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
