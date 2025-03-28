import { TestBed } from '@angular/core/testing';

import { HeroImageService } from './hero-image.service';

describe('HeroImageService', () => {
  let service: HeroImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
