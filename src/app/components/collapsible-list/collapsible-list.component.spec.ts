import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleListComponent } from './collapsible-list.component';

describe('SectionComponent', () => {
  let component: CollapsibleListComponent;
  let fixture: ComponentFixture<CollapsibleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsibleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
