import { ComponentFixture, TestBed } from '@angular/core/testing';

import { watchmenDetailComponent } from './watchmen-detail.component';

describe('watchmenDetailComponent', () => {
  let component: watchmenDetailComponent;
  let fixture: ComponentFixture<watchmenDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [watchmenDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(watchmenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
