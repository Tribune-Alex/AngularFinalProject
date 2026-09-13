import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingCoach } from './booking-coach';

describe('BookingCoach', () => {
  let component: BookingCoach;
  let fixture: ComponentFixture<BookingCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCoach],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCoach);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
