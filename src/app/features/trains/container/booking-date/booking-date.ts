import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainservice } from '../../services/trainservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateBooking } from '../../models/bookingmodels';
import { Authservice } from '../../../auth/services/authservice';
import { Seat } from '../../models/trainmodels';
import { forkJoin, map } from 'rxjs';
import { jsPDF } from 'jspdf';

@Component({
  imports: [],
  selector: 'app-booking-date',
  styleUrl: './booking-date.scss',
  templateUrl: './booking-date.html',
})
export class BookingDate {

  private route = inject(ActivatedRoute);
  private trainService = inject(Trainservice);
  private authService = inject(Authservice);
  public today = new Date().toISOString().split('T')[0];
  public selectedDate = signal<string>('');
  public selectedScheduleId = signal<number | null>(Number(this.route.snapshot.queryParamMap.get('scheduleId')) || null);
  public selectedDatesBySchedule = signal<Record<number, string>>({});
  public bookingSelection = signal<Record<number, Record<string, Record<number, number[]>>>>({});
  public pdfSeatsByCoach = signal<Record<number, Seat[]>>({});
  public trainId = Number(this.route.snapshot.paramMap.get('trainId'));
  public coachId = signal<number>(Number(this.route.snapshot.paramMap.get('coachId')));
  private n8nWebhookUrl = 'http://localhost:5678/webhook-test/train-booking-confirmation';
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

  public train = rxResource({
    params: () => this.trainId,

    stream: ({ params }) => {
      return this.trainService.getTrainById(params);
    }
  });

  public userProfile = rxResource({
    stream: () => {
      return this.authService.getProfile();
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
        this.sendTicketToN8n();
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

  getSelectedCoachIds(): number[] {
    const selection = this.bookingSelection();

    const coachIds: number[] = [];

    Object.values(selection).forEach(scheduleDates => {

      Object.values(scheduleDates).forEach(coaches => {

        Object.entries(coaches).forEach(
          ([coachIdString, seatIds]) => {

            if (seatIds.length === 0) {
              return;
            }

            const coachId = Number(coachIdString);

            if (!coachIds.includes(coachId)) {
              coachIds.push(coachId);
            }
          }
        );

      });

    });

    return coachIds;
  }


  loadSeatsForPdf() {

    const coachIds = this.getSelectedCoachIds();

    if (coachIds.length === 0) {
      return null;
    }

    const requests = coachIds.map(coachId =>
      this.trainService.getSeatsByCoachId(coachId)
    );

    return forkJoin(requests).pipe(
      map(responses => {

        const seatsByCoach: Record<number, Seat[]> = {};

        responses.forEach((response, index) => {

          const coachId = coachIds[index];

          seatsByCoach[coachId] = response.data;
          console.log(
            `COACH ${coachId} SEATS:`,
            response.data
          );

        });

        this.pdfSeatsByCoach.set(seatsByCoach);

        console.log(
          'PDF SEATS BY COACH:',
          this.pdfSeatsByCoach()
        );

        return seatsByCoach;
      })
    );
  }

  generateTicketPdf(): Blob | null {

    const train = this.train.value()?.data;

    if (!train) {
      return null;
    }

    const selection = this.bookingSelection();

    const selectedScheduleIds = Object.keys(selection)
      .map(id => Number(id));

    if (selectedScheduleIds.length === 0) {
      return null;
    }

    console.log(
      'PDF SELECTED SCHEDULE IDS:',
      selectedScheduleIds
    );

    const pdf = new jsPDF();



    pdf.setFillColor(11, 17, 32);
    pdf.rect(0, 0, 210, 45, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');

    pdf.text(
      'STEP TRAINS',
      20,
      22
    );

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    pdf.text(
      'BOOKING CONFIRMATION',
      20,
      33
    );

    pdf.setTextColor(20, 20, 20);


    let y = 60;


    let grandTotal = 0;


    let ticketNumber = 1;



    selectedScheduleIds.forEach(scheduleId => {

      const schedule = train.schedules.find(
        item => item.id === scheduleId
      );

      if (!schedule) {
        return;
      }

      const scheduleSelection =
        selection[scheduleId] ?? {};



      Object.entries(scheduleSelection).forEach(
        ([travelDate, coaches]) => {



          Object.entries(coaches).forEach(
            ([coachIdString, seatIds]) => {

              if (seatIds.length === 0) {
                return;
              }

              const coachId = Number(coachIdString);

              const coach = train.coaches.find(
                item => item.id === coachId
              );

              if (!coach) {
                return;
              }



              const coachSeats =
                this.pdfSeatsByCoach()[coachId] ?? [];

              const selectedSeatNumbers = coachSeats
                .filter(seat =>
                  seatIds.includes(seat.id)
                )
                .map(seat => seat.number);

              const totalPrice =
                coach.price * seatIds.length;

              grandTotal += totalPrice;

              console.log(
                'PDF TICKET:',
                {
                  scheduleId,
                  travelDate,
                  coachId,
                  seatIds,
                  selectedSeatNumbers,
                  totalPrice
                }
              );

              

              if (y > 220) {

                pdf.addPage();

                y = 25;
              }

              

              pdf.setFontSize(10);
              pdf.setFont(
                'helvetica',
                'normal'
              );
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                `TICKET ${ticketNumber}`,
                20,
                y
              );

              y += 10;



              pdf.setFontSize(10);
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                'TRAIN',
                20,
                y
              );

              y += 8;

              pdf.setFontSize(15);
              pdf.setFont(
                'helvetica',
                'bold'
              );
              pdf.setTextColor(
                20,
                20,
                20
              );

              pdf.text(
                `${train.name} #${train.number}`,
                20,
                y
              );

              y += 14;



              pdf.setFontSize(10);
              pdf.setFont(
                'helvetica',
                'normal'
              );
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                'ROUTE',
                20,
                y
              );

              y += 8;

              pdf.setFontSize(13);
              pdf.setFont(
                'helvetica',
                'bold'
              );
              pdf.setTextColor(
                20,
                20,
                20
              );

              pdf.text(
                `${schedule.origin} -> ${schedule.destination}`,
                20,
                y
              );

              y += 16;



              pdf.setFontSize(10);
              pdf.setFont(
                'helvetica',
                'normal'
              );
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                'TRAVEL DATE',
                20,
                y
              );

              pdf.text(
                'DEPARTURE',
                110,
                y
              );

              y += 9;

              pdf.setFontSize(13);
              pdf.setFont(
                'helvetica',
                'bold'
              );
              pdf.setTextColor(
                20,
                20,
                20
              );

              pdf.text(
                travelDate,
                20,
                y
              );

              pdf.text(
                schedule.departureTime,
                110,
                y
              );

              y += 17;



              pdf.setFontSize(10);
              pdf.setFont(
                'helvetica',
                'normal'
              );
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                'COACH',
                20,
                y
              );

              pdf.text(
                'SEATS',
                110,
                y
              );

              y += 9;

              pdf.setFontSize(13);
              pdf.setFont(
                'helvetica',
                'bold'
              );
              pdf.setTextColor(
                20,
                20,
                20
              );

              pdf.text(
                `${coach.number} (${coach.class})`,
                20,
                y
              );

              pdf.text(
                selectedSeatNumbers.join(', '),
                110,
                y
              );

              y += 15;



              pdf.setFillColor(
                245,
                247,
                250
              );

              pdf.roundedRect(
                20,
                y,
                170,
                25,
                4,
                4,
                'F'
              );

              pdf.setFontSize(10);
              pdf.setFont(
                'helvetica',
                'normal'
              );
              pdf.setTextColor(
                100,
                100,
                100
              );

              pdf.text(
                'PRICE',
                30,
                y + 10
              );

              pdf.setFontSize(16);
              pdf.setFont(
                'helvetica',
                'bold'
              );
              pdf.setTextColor(
                20,
                20,
                20
              );

              pdf.text(
                `${totalPrice} GEL`,
                30,
                y + 20
              );

              y += 38;


              pdf.setDrawColor(
                220,
                220,
                220
              );

              pdf.line(
                20,
                y,
                190,
                y
              );

              y += 15;

              ticketNumber++;
            }
          );
        }
      );
    });



    if (y > 230) {

      pdf.addPage();

      y = 25;
    }

    pdf.setFillColor(
      11,
      17,
      32
    );

    pdf.roundedRect(
      20,
      y,
      170,
      32,
      4,
      4,
      'F'
    );

    pdf.setFontSize(10);
    pdf.setFont(
      'helvetica',
      'normal'
    );
    pdf.setTextColor(
      200,
      200,
      200
    );

    pdf.text(
      'TOTAL BOOKING PRICE',
      30,
      y + 12
    );

    pdf.setFontSize(18);
    pdf.setFont(
      'helvetica',
      'bold'
    );
    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.text(
      `${grandTotal} GEL`,
      30,
      y + 24
    );

    y += 48;



    pdf.setFontSize(10);
    pdf.setFont(
      'helvetica',
      'normal'
    );
    pdf.setTextColor(
      100,
      100,
      100
    );

    pdf.text(
      'Thank you for choosing STEP TRAINS.',
      20,
      y
    );

    pdf.text(
      'Please keep this ticket for your journey.',
      20,
      y + 8
    );



    const pdfBlob = pdf.output('blob');

    console.log(
      'PDF BLOB:',
      pdfBlob
    );

    return pdfBlob;
  }

  sendTicketToN8n(): void {

    const seatsRequest = this.loadSeatsForPdf();

    if (!seatsRequest) {
      console.error('No coaches selected for PDF.');
      return;
    }

    seatsRequest.subscribe({

      next: () => {

        console.log(
          'ALL SEATS LOADED FOR PDF:',
          this.pdfSeatsByCoach()
        );

        const pdfBlob = this.generateTicketPdf();

        if (!pdfBlob) {
          console.error('PDF could not be generated.');
          return;
        }

        const train = this.train.value()?.data;

        if (!train) {
          console.error('Train data not found.');
          return;
        }

        const user = this.userProfile.value()?.data;

        if (!user) {
          console.error('User profile not found.');
          return;
        }

        const selection = this.bookingSelection();

        let grandTotal = 0;

        const ticketDetails: {
          scheduleId: number;
          origin: string;
          destination: string;
          departureTime: string;
          travelDate: string;
          coachNumber: number;
          coachClass: string;
          seats: string[];
          price: number;
        }[] = [];

        

        Object.entries(selection).forEach(
          ([scheduleIdString, dates]) => {

            const scheduleId =
              Number(scheduleIdString);

            const schedule = train.schedules.find(
              item => item.id === scheduleId
            );

            if (!schedule) {
              return;
            }

            Object.entries(dates).forEach(
              ([travelDate, coaches]) => {

                Object.entries(coaches).forEach(
                  ([coachIdString, seatIds]) => {

                    if (seatIds.length === 0) {
                      return;
                    }

                    const coachId =
                      Number(coachIdString);

                    const coach = train.coaches.find(
                      item => item.id === coachId
                    );

                    if (!coach) {
                      return;
                    }

                    const coachSeats =
                      this.pdfSeatsByCoach()[coachId] ?? [];

                    const selectedSeatNumbers =
                      coachSeats
                        .filter(seat =>
                          seatIds.includes(seat.id)
                        )
                        .map(seat => seat.number);

                    const price =
                      coach.price * seatIds.length;

                    grandTotal += price;

                    ticketDetails.push({
                      scheduleId,
                      origin: schedule.origin,
                      destination: schedule.destination,
                      departureTime: schedule.departureTime,
                      travelDate,
                      coachNumber: coach.number,
                      coachClass: coach.class,
                      seats: selectedSeatNumbers,
                      price
                    });

                  }
                );

              }
            );

          }
        );

        if (ticketDetails.length === 0) {
          console.error(
            'No ticket details found.'
          );
          return;
        }

        console.log(
          'ALL TICKET DETAILS:',
          ticketDetails
        );

        console.log(
          'GRAND TOTAL:',
          grandTotal
        );

        

        const formData = new FormData();

        formData.append(
          'email',
          user.email
        );

        formData.append(
          'trainName',
          train.name
        );

        formData.append(
          'trainNumber',
          train.number.toString()
        );

        formData.append(
          'tickets',
          JSON.stringify(ticketDetails)
        );

        formData.append(
          'totalPrice',
          grandTotal.toString()
        );

        formData.append(
          'ticket',
          pdfBlob,
          'STEP-TRAINS-Ticket.pdf'
        );

        console.log(
          'PDF READY FOR N8N:',
          pdfBlob
        );

        

        this.trainService
          .sendBookingConfirmation(formData)
          .subscribe({

            next: (response) => {

              console.log(
                'N8N CONFIRMATION SUCCESS:',
                response
              );

            },

            error: (error) => {

              console.error(
                'N8N CONFIRMATION ERROR:',
                error
              );

            }

          });

      },

      error: (error) => {

        console.error(
          'SEATS LOADING ERROR:',
          error
        );

      }

    });

  }

  

}
