import { TestBed } from '@angular/core/testing';

import { StyleSingletonService } from './style-singleton.service';

describe('StyleSingletonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StyleSingletonService = TestBed.get(StyleSingletonService);
    expect(service).toBeTruthy();
  });
});
