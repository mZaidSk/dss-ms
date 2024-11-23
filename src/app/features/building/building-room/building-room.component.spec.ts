import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingRoomComponent } from './building-room.component';

describe('BuildingRoomComponent', () => {
  let component: BuildingRoomComponent;
  let fixture: ComponentFixture<BuildingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
