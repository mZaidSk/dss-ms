import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchmenAssignmentsComponent } from './watchmen-assignments.component';

describe('WatchmenAssignmentsComponent', () => {
  let component: WatchmenAssignmentsComponent;
  let fixture: ComponentFixture<WatchmenAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchmenAssignmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchmenAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
