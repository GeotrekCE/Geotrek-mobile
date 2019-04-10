import { TestBed } from '@angular/core/testing';

import { OnlineTreksService } from './online-treks.service';

describe('OnlineTreksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlineTreksService = TestBed.get(OnlineTreksService);
    expect(service).toBeTruthy();
  });
});
