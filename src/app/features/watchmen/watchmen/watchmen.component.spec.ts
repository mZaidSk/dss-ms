import { ComponentFixture, TestBed } from '@angular/core/testing';

import { watchmenComponent } from './watchmen.component';

describe('watchmenComponent', () => {
  let component: watchmenComponent;
  let fixture: ComponentFixture<watchmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [watchmenComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(watchmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
