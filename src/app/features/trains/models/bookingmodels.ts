export interface CreateBooking {
    scheduleId: number;
    seatId: number[];
    travelDate: string;
  }

  export interface Booking {
    id: number;
    travelDate: string;
    scheduleId: number;
  
    origin: string;
    destination: string;
    departureTime: string;
  
    price: number;
  
    seatId: number;
    seatNumber: string;
  
    coachNumber: number;
    coachClass: string;
  
    trainNumber: number;
    trainName: string;
  
    createdAt: string;
  }

  export interface BookingsResponse {
    data: {
      items: Booking[];
    };
  }


  export interface BookingDetails extends Booking {
    trainId: number;
    trainThumbnail: string;
  }
  
  export interface BookingDetailsResponse {
    data: BookingDetails;
  }


  export interface UpdateBookingDateRequest {
    travelDate: string;
  }