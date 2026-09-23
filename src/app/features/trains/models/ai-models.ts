export interface AiTicketData {
    email: string;
    trainName: string;
    trainNumber: number;
    travelDate: string;
    origin: string;
    destination: string;
    departureTime: string;
    coachNumber: number;
    coachClass: string;
    seatNumber: string;
    price: number;
    bookingId: number;
    totalPrice: number;
    tickets: string;
  }
  
  export interface AiResponse {
    success?: boolean;
    message?: string;
    output?: string;
    trainNumber?: number;
    bookingId?: number;
    scheduleId?: number;
    ticketData?: AiTicketData;
    coaches?: AiCoach[];
    seats?: AiSeat[];
  }

  export interface AiCoach {
    coachId: number;
    coachNumber: number;
    class: string;
    price: number;
    trainId: number;
    seatCount: number;
  }

  export interface AiSeat {
    id: number;
    number: string;
    coachId: number;
  }