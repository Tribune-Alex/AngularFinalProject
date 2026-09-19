import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainservice } from '../../services/trainservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateBooking } from '../../models/bookingmodels';
import { forkJoin } from 'rxjs';

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
  public selectedScheduleId = signal<number | null>(Number(this.route.snapshot.queryParamMap.get('scheduleId')) || null);
  public selectedDatesBySchedule = signal<Record<number, string>>({});
  public bookingSelection = signal<Record<number, Record<string, Record<number, number[]>>>>({});
  public trainId = Number(this.route.snapshot.paramMap.get('trainId'));
  public coachId = signal<number>(Number(this.route.snapshot.paramMap.get('coachId')));

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
    const scheduleId = this.selectedScheduleId();

    if (scheduleId === null) {
      return;
    }

    this.selectedDate.set(date);

    this.selectedDatesBySchedule.update(dates => ({
      ...dates,
      [scheduleId]: date
    }));

    console.log(
      'SELECTED DATES BY SCHEDULE:',
      this.selectedDatesBySchedule()
    );
  }

  public schedules = rxResource({
    stream: () => {
      return this.trainService.getSchedules();
    }
  });

  public trainSchedules = computed(() => {
    const items = this.schedules.value()?.data.items ?? [];

    return items.filter(item => item.trainId === this.trainId);
  });

  public selectedSeatsCount = computed(() => {
    const selection = this.bookingSelection();

    return Object.values(selection)
      .flatMap(dates => Object.values(dates))
      .flatMap(coaches => Object.values(coaches))
      .reduce(
        (total, seatIds) => total + seatIds.length,
        0
      );
  });


  selectSchedule(id: number): void {
    this.selectedScheduleId.set(id);

    const savedDate = this.selectedDatesBySchedule()[id] ?? '';

    this.selectedDate.set(savedDate);

    console.log('SELECTED SCHEDULE ID:', id);
    console.log('SCHEDULE DATE:', savedDate);
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
    const scheduleId = this.selectedScheduleId();
    const date = this.selectedDate();
    const coachId = this.coachId();

    if (scheduleId === null || !date) {
      return;
    }

    const selection = this.bookingSelection();

    const scheduleSelection = selection[scheduleId] ?? {};
    const dateSelection = scheduleSelection[date] ?? {};
    const coachSeats = dateSelection[coachId] ?? [];

    let updatedSeats: number[];

    if (coachSeats.includes(seatId)) {
      updatedSeats = coachSeats.filter(
        id => id !== seatId
      );
    } else {
      updatedSeats = [
        ...coachSeats,
        seatId
      ];
    }

    this.bookingSelection.set({
      ...selection,

      [scheduleId]: {
        ...scheduleSelection,

        [date]: {
          ...dateSelection,
          [coachId]: updatedSeats
        }
      }
    });

    console.log(
      'BOOKING SELECTION:',
      this.bookingSelection()
    );
  }

  selectCoach(coachId: number): void {
    this.coachId.set(coachId);



    console.log('COACH ID:', this.coachId());
  }


  createBooking(): void {
    const selection = this.bookingSelection();
  
    if (this.selectedSeatsCount() === 0) {
      return;
    }
  
    this.bookingError.set('');
  
    const bookings: CreateBooking[] = [];
  
    Object.entries(selection).forEach(
      ([scheduleIdString, dates]) => {
  
        const scheduleId = Number(scheduleIdString);
  
        Object.entries(dates).forEach(
          ([travelDate, coaches]) => {
  
            const seatIds = Object.values(coaches).flat();
  
            if (seatIds.length === 0) {
              return;
            }
  
            bookings.push({
              scheduleId: scheduleId,
              seatId: seatIds,
              travelDate: new Date(travelDate).toISOString()
            });
  
          }
        );
      }
    );
  
    if (bookings.length === 0) {
      return;
    }
  
    console.log('BOOKINGS:', bookings);
  
    this.bookingLoading.set(true);
  
    const requests = bookings.map(booking =>
      this.trainService.createBooking(booking)
    );
  
    forkJoin(requests).subscribe({
  
      next: (responses) => {
        console.log('BOOKINGS SUCCESS:', responses);
  
        this.bookingLoading.set(false);
        this.bookingSuccess.set(true);
      },
  
      error: (error) => {
        console.log('BOOKINGS ERROR:', error);
  
        this.bookingLoading.set(false);
  
        this.bookingError.set(
          'Booking failed. Please try again.'
        );
      }
  
    });
  }

  goToBookings(): void {
    this.bookingSelection.set({});
    this.selectedDatesBySchedule.set({});
    this.bookingSuccess.set(false);
    this.router.navigate(['/profile'], {
      queryParams: {
        section: 'bookings'
      }
    });
  }

  closeBookingSuccess(): void {
    this.bookingSuccess.set(false);
    this.bookingSelection.set({});
    this.selectedDatesBySchedule.set({});
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectDate(input.value);
  }
}
