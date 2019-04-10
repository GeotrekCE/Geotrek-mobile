import { TestBed } from '@angular/core/testing';

import { MoreInformationsService } from './more-informations.service';

describe('MoreInformationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoreInformationsService = TestBed.get(MoreInformationsService);
    expect(service).toBeTruthy();
  });
});
