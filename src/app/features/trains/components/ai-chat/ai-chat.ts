import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { AiCoach, AiResponse, AiSeat, AiTicketData } from '../../models/ai-models';
import { Trainservice } from '../../services/trainservice';
import { jsPDF } from 'jspdf';

@Component({
  imports: [],
  selector: 'app-ai-chat',
  styleUrl: './ai-chat.scss',
  templateUrl: './ai-chat.html',
})
export class AiChat {

  private trainService = inject(Trainservice);

  public message = signal<string>('');
  public loading = signal<boolean>(false);
  public error = signal<string>('');
  public aiResponse = signal<AiResponse | null>(null);
  public availableCoaches = signal<AiCoach[]>([]);
  public availableSeats = signal<AiSeat[]>([]);
  public selectedSeatId = signal<number | null>(null);
  public selectedScheduleId = signal<number | null>(null);
  public selectedTravelDate = signal<string | null>(null);
  public conversationHistory = signal<string[]>([]);
  public isMinimized = signal(false);
  public selectedTrainNumber = signal<number | null>(null);
  public selectedCoachId = signal<number | null>(null);
  @ViewChild('chatMessages') chatMessages?: ElementRef<HTMLDivElement>;

  onMessageInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.message.set(input.value);
  }

  onEnter(event: Event): void {
    

    event.preventDefault();
  
    if (
      !this.message().trim() ||
      this.loading()
    ) {
      return;
    }
  
    this.sendMessage();
  }

  toggleChat(): void {
    this.isMinimized.update(value => !value);
  }

  scrollToBottom(): void {

    setTimeout(() => {

      const element =
        this.chatMessages?.nativeElement;

      if (!element) {
        return;
      }

      element.scrollTop =
        element.scrollHeight;

    });

  }

  generateAiTicketPdf(ticket: AiTicketData): Blob {
    const pdf = new jsPDF();

    // HEADER
    pdf.setFillColor(11, 17, 32);

    pdf.rect(
      0,
      0,
      210,
      45,
      'F'
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFontSize(22);
    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.text(
      'STEP TRAINS',
      20,
      22
    );

    pdf.setFontSize(12);
    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.text(
      'BOOKING CONFIRMATION',
      20,
      33
    );

    // TICKET NUMBER
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
      'TICKET 1',
      20,
      60
    );


    // TRAIN
    pdf.text(
      'TRAIN',
      20,
      70
    );

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
      `${ticket.trainName} #${ticket.trainNumber}`,
      20,
      78
    );

    // ROUTE
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
      92
    );

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
      `${ticket.origin} -> ${ticket.destination}`,
      20,
      100
    );

    // TRAVEL DATE + DEPARTURE
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
      116
    );

    pdf.text(
      'DEPARTURE',
      110,
      116
    );

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
      ticket.travelDate.split('T')[0],
      20,
      125
    );

    pdf.text(
      ticket.departureTime,
      110,
      125
    );

    // COACH + SEATS
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
      142
    );

    pdf.text(
      'SEATS',
      110,
      142
    );

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
      `${ticket.coachNumber} (${ticket.coachClass})`,
      20,
      151
    );

    pdf.text(
      ticket.seatNumber,
      110,
      151
    );

    // PRICE
    pdf.setFillColor(
      245,
      247,
      250
    );

    pdf.roundedRect(
      20,
      165,
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
      175
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
      `${ticket.price} GEL`,
      30,
      185
    );

    // TOTAL BOOKING PRICE
    pdf.setFillColor(
      11,
      17,
      32
    );

    pdf.roundedRect(
      20,
      202,
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
      214
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
      `${ticket.totalPrice} GEL`,
      30,
      226
    );

    // FOOTER
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
      250
    );

    pdf.text(
      'Please keep this ticket for your journey.',
      20,
      258
    );

    return pdf.output('blob');
  }



  sendMessage(): void {

    const text = this.message().trim();

    if (!text) {
      return;
    }

    const coachNumber = Number(text);

    const selectedCoach = this.availableCoaches().find(
      coach => coach.coachNumber === coachNumber
    );

    if (selectedCoach) {
      this.selectedCoachId.set(selectedCoach.coachId);

      console.log(
        'COACH ID BEFORE REQUEST:',
        this.selectedCoachId()
      );
    }

    const selectedSeat = this.availableSeats().find(
      seat => seat.number.toLowerCase() === text.toLowerCase()
    );

    if (selectedSeat) {

      this.selectedSeatId.set(selectedSeat.id);

      console.log(
        'SEAT ID BEFORE REQUEST:',
        this.selectedSeatId()
      );
    }


    this.conversationHistory.update(history => [
      ...history,
      `User: ${text}`
    ]);

    this.scrollToBottom();
    this.message.set('');
    this.error.set('');
    this.aiResponse.set(null);
    this.loading.set(true);

    const isTravelDate = /^\d{4}-\d{2}-\d{2}$/.test(text);

    if (
      isTravelDate &&
      this.selectedSeatId() !== null
    ) {
      this.selectedTravelDate.set(text);

      console.log(
        'TRAVEL DATE BEFORE REQUEST:',
        this.selectedTravelDate()
      );
    }

    this.trainService
      .sendAiMessage(
        text,
        this.conversationHistory(),
        this.selectedTrainNumber(),
        this.selectedCoachId(),
        this.selectedSeatId(),
        this.selectedScheduleId(),
        this.selectedTravelDate()
      )
      .subscribe({

        next: (response) => {

          console.log(
            'AI RESPONSE:',
            response
          );

          const ticketData = response.ticketData;

          if (response.success && ticketData) {
            console.log(
              'AI BOOKING SUCCESS:',
              ticketData
            );

            const pdfBlob = this.generateAiTicketPdf(
              ticketData
            );

            console.log(
              'AI TICKET PDF:',
              pdfBlob
            );

            const formData = new FormData();

            formData.append(
              'email',
              ticketData.email
            );

            formData.append(
              'trainName',
              ticketData.trainName
            );

            formData.append(
              'trainNumber',
              ticketData.trainNumber.toString()
            );

            formData.append(
              'tickets',
              ticketData.tickets
            );

            formData.append(
              'totalPrice',
              ticketData.totalPrice.toString()
            );

            formData.append(
              'ticket',
              pdfBlob,
              'STEP-TRAINS-AI-Ticket.pdf'
            );

            this.trainService
              .sendBookingConfirmation(formData)
              .subscribe({

                next: (response) => {
                  console.log(
                    'AI EMAIL SUCCESS:',
                    response
                  );
                },

                error: (error) => {
                  console.error(
                    'AI EMAIL ERROR:',
                    error
                  );
                }

              });
          }

          if (response.success && response.ticketData) {
            console.log('AI BOOKING SUCCESS:', response.ticketData);
          }

          this.aiResponse.set(response);
          if (response.seats) {

            this.availableSeats.set(response.seats);

            console.log(
              'AVAILABLE SEATS SAVED:',
              this.availableSeats()
            );
          }
          if (response.coaches) {

            console.log(
              'AI COACHES:',
              response.coaches
            );

            this.availableCoaches.set(response.coaches);

            console.log(
              'AVAILABLE COACHES SAVED:',
              this.availableCoaches()
            );

            const coachNumber = Number(text);

            const selectedCoach = response.coaches.find(
              coach => coach.coachNumber === coachNumber
            );

            if (selectedCoach) {

              this.selectedCoachId.set(
                selectedCoach.coachId
              );

              console.log(
                'SELECTED COACH ID:',
                this.selectedCoachId()
              );
            }
          }

          if (response.trainNumber !== undefined) {
            this.selectedTrainNumber.set(response.trainNumber);

            console.log(
              'SELECTED TRAIN NUMBER:',
              this.selectedTrainNumber()
            );
          }

          if (response.scheduleId !== undefined) {
            this.selectedScheduleId.set(response.scheduleId);

            console.log(
              'SELECTED SCHEDULE ID:',
              this.selectedScheduleId()
            );
          }


          const aiText =
            response.message ||
            response.output ||
            '';


          if (aiText) {

            this.conversationHistory.update(history => [
              ...history,
              `AI: ${aiText}`
            ]);

            this.scrollToBottom();
          }

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'AI ERROR:',
            error
          );

          this.error.set(
            'AI assistant request failed.'
          );

          this.loading.set(false);
        }

      });
  }

}
