import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingDate } from './booking-date';

describe('BookingDate', () => {
  let component: BookingDate;
  let fixture: ComponentFixture<BookingDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDate],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
