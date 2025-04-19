import { TestBed } from '@angular/core/testing';

import { FeaturedPropertyService } from './featured-property.service';

describe('FeaturedPropertyService', () => {
  let service: FeaturedPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
