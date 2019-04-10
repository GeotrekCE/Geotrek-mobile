import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectErrorComponent } from './connect-error.component';

describe('ConnectErrorComponent', () => {
  let component: ConnectErrorComponent;
  let fixture: ComponentFixture<ConnectErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
