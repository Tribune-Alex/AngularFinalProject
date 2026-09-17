import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainservice } from '../../services/trainservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateBooking } from '../../models/bookingmodels';

@Component({
  imports: [],
  selector: 'app-booking-date',
  styleUrl: './booking-date.scss',
  templateUrl: './booking-date.html',
})
export class BookingDate {

  private route = inject(ActivatedRoute);
  private trainService = inject(Trainservice);
  public selectedDate = signal<string>('');
  public selectedScheduleId = signal<number | null>(
    Number(this.route.snapshot.queryParamMap.get('scheduleId')) || null
  );
  public selectedSeatIds = signal<number[]>([]);
  public trainId = Number(this.route.snapshot.paramMap.get('trainId'));
  public coachId = signal<number>(
    Number(this.route.snapshot.paramMap.get('coachId'))
  );

  public bookingSuccess = signal<boolean>(false);
  public bookingLoading = signal<boolean>(false);
  public bookingError = signal<string>('');
  private router = inject(Router);

  constructor() {
    console.log('TRAIN ID:', this.trainId);
    console.log('COACH ID:', this.coachId());
  }

  public coaches = rxResource({
    params: () => this.trainId,
    stream: ({ params }) => {
      return this.trainService.getCoachesByTrainId(params);
    }
  });

  selectDate(date: string): void {
    this.selectedDate.set(date);
    console.log('SELECTED DATE:', date);
  };

  public schedules = rxResource({
    stream: () => {
      return this.trainService.getSchedules();
    }
  });

  public trainSchedules = computed(() => {
    const items = this.schedules.value()?.data.items ?? [];

    return items.filter(item => item.trainId === this.trainId);
  });


  selectSchedule(id: number): void {
    this.selectedScheduleId.set(id);
    console.log('SELECTED SCHEDULE ID:', id);
  }

  public availableSeats = rxResource({
    params: () => {
      const scheduleId = this.selectedScheduleId();
      const travelDate = this.selectedDate();

      if (scheduleId === null || !travelDate) {
        return undefined;
      }

      return {
        scheduleId,
        coachId: this.coachId(),
        travelDate
      };
    },

    stream: ({ params }) => {
      return this.trainService.getSeatAvailability(
        params.scheduleId,
        params.coachId,
        params.travelDate
      );
    }
  });

  selectSeat(seatId: number): void {
    const current = this.selectedSeatIds();

    if (current.includes(seatId)) {
      this.selectedSeatIds.set(
        current.filter(id => id !== seatId)
      );
    } else {
      this.selectedSeatIds.set([
        ...current,
        seatId
      ]);
    }

    console.log('SELECTED SEATS:', this.selectedSeatIds());
  }

  selectCoach(coachId: number): void {
    this.coachId.set(coachId);

    this.selectedSeatIds.set([]);

    console.log('COACH ID:', this.coachId());
  }


  createBooking(): void {
    const scheduleId = this.selectedScheduleId();
  
    if (
      scheduleId === null ||
      !this.selectedDate() ||
      this.selectedSeatIds().length === 0
    ) {
      return;
    }
    this.bookingError.set('');
  
    const booking: CreateBooking = {
      scheduleId: scheduleId,
      seatId: this.selectedSeatIds(),
      travelDate: new Date(this.selectedDate()).toISOString()
    };
  
    console.log('BOOKING:', booking);
    this.bookingLoading.set(true);
    this.trainService.createBooking(booking).subscribe({
      next: (response) => {
        console.log('BOOKING SUCCESS:', response);
        this.bookingLoading.set(false);
        this.bookingSuccess.set(true);
      },
    
      error: (error) => {
        console.log('BOOKING ERROR:', error);
      
        this.bookingLoading.set(false);
        this.bookingError.set('Booking failed. Please try again.');
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/profile'], {
      queryParams: {
        section: 'bookings'
      }
    });
  }
  
  closeBookingSuccess(): void {
    this.bookingSuccess.set(false);
  }
}
