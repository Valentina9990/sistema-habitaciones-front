import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomVerificationComponent } from './room-verification.component';

describe('RoomVerificationComponent', () => {
  let component: RoomVerificationComponent;
  let fixture: ComponentFixture<RoomVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
