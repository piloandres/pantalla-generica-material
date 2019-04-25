import { TestBed } from '@angular/core/testing';

import { MyCacheService } from './my-cache.service';

describe('MyCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyCacheService = TestBed.get(MyCacheService);
    expect(service).toBeTruthy();
  });
});
