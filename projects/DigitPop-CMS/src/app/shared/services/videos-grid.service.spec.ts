import { TestBed } from '@angular/core/testing';

import { VideosGridService } from './videos-grid.service';

describe('VideosGridService', () => {
  let service: VideosGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
