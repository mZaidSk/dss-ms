import { TestBed } from '@angular/core/testing';

import { watchmenService } from './watchmen.service';

describe('watchmenService', () => {
  let service: watchmenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(watchmenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
