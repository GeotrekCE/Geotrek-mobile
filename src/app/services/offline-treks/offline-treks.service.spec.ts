import { TestBed } from '@angular/core/testing';

import { OfflineTreksService } from './offline-treks.service';

describe('OfflineTreksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfflineTreksService = TestBed.get(OfflineTreksService);
    expect(service).toBeTruthy();
  });
});
