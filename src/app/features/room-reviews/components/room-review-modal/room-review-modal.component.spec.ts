import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomReviewModalComponent } from './room-review-modal.component';

describe('RoomReviewModalComponent', () => {
  let component: RoomReviewModalComponent;
  let fixture: ComponentFixture<RoomReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomReviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
