import { TestBed } from '@angular/core/testing';

import { WatchmenAssignmentsService } from './watchmen-assignments.service';

describe('WatchmenAssignmentsService', () => {
  let service: WatchmenAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchmenAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
