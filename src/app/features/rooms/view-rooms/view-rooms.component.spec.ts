import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoomsComponent } from './view-rooms.component';

describe('ViewRoomsComponent', () => {
  let component: ViewRoomsComponent;
  let fixture: ComponentFixture<ViewRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
