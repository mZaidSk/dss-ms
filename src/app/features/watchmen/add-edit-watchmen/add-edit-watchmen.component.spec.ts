import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditwatchmenComponent } from './add-edit-watchmen.component';

describe('AddEditwatchmenComponent', () => {
  let component: AddEditwatchmenComponent;
  let fixture: ComponentFixture<AddEditwatchmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditwatchmenComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditwatchmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
