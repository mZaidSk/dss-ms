import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedInputComponent } from './nested-input.component';

describe('NestedInputComponent', () => {
  let component: NestedInputComponent;
  let fixture: ComponentFixture<NestedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
