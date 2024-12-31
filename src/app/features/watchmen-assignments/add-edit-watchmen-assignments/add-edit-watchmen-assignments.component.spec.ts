import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWatchmenAssignmentsComponent } from './add-edit-watchmen-assignments.component';

describe('AddEditWatchmenAssignmentsComponent', () => {
  let component: AddEditWatchmenAssignmentsComponent;
  let fixture: ComponentFixture<AddEditWatchmenAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditWatchmenAssignmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditWatchmenAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
