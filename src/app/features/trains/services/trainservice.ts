import { inject, Service, signal } from '@angular/core';
import { CoachesResponse, SchedulesResponse, SeatAvailabilityResponse, SeatsResponse, StationsResponse, Train, TrainDetailsResponse, TrainsResponse } from '../models/trainmodels';
import { HttpClient, httpResource } from '@angular/common/http';
import { BookingDetailsResponse, BookingsResponse, CreateBooking, UpdateBookingDateRequest } from '../models/bookingmodels';
import { AiResponse } from '../models/ai-models';

@Service()
export class Trainservice {
  public url: string = "https://trainsapi.stepacademy.ge/api/trains"
  public searchUrl: string = "https://trainsapi.stepacademy.ge/api/trains/search"
  public stationsUrl = 'https://trainsapi.stepacademy.ge/api/stations';
  public fromStationId = signal<number | null>(null);


  private http = inject(HttpClient)


  getTrains() {
    return this.http.get<TrainsResponse>(this.url)
  }
  getTrainById(id: number) {
    return this.http.get<TrainDetailsResponse>(
      `${this.url}/${id}`
    )
  }

  searchTrainByNumber(query: string) {
    return this.http.get<TrainsResponse>(
      this.searchUrl,
      {
        params: {
          query: query,
          Take: 10,
          Page: 1
        }
      }
    );
  }




  public stations = httpResource<StationsResponse>(
    () => this.stationsUrl
  );


  public toStations = httpResource<StationsResponse>(() => {
    const id = this.fromStationId();

    if (id === null) {
      return undefined;
    }

    return `${this.stationsUrl}/to/${id}`;
  });


  public filterTrains(origin: string, destination: string) {
    return this.http.get<TrainsResponse>(
      `${this.url}/filter`,
      {
        params: {
          origin: origin,
          destination: destination,
          Take: 5,
          Page: 1
        }
      }
    );
  }

  getSchedules() {
    return this.http.get<SchedulesResponse>(
      'https://trainsapi.stepacademy.ge/api/schedules'
    );
  }


  searchSchedules(
    query: string,
    take: number = 10,
    page: number = 1
  ) {
    return this.http.get<SchedulesResponse>(
      'https://trainsapi.stepacademy.ge/api/schedules/search',
      {
        params: {
          query,
          Take: take,
          Page: page
        }
      }
    );
  }

  getCoachesByTrainId(trainId: number) {
    return this.http.get<CoachesResponse>(
      `https://trainsapi.stepacademy.ge/api/coaches/train/${trainId}`
    );
  }

  filterCoaches(
    trainId: number,
    coachClass: number,
    take: number = 10,
    page: number = 1
  ) {
    return this.http.get<CoachesResponse>(
      'https://trainsapi.stepacademy.ge/api/coaches/filter',
      {
        params: {
          trainId: trainId,
          class: coachClass,
          Take: take,
          Page: page
        }
      }
    );
  }

  getSeatsByCoachId(coachId: number) {
    return this.http.get<SeatsResponse>(
      `https://trainsapi.stepacademy.ge/api/seats/coach/${coachId}`
    );
  }

  getSeatAvailability(
    scheduleId: number,
    coachId: number,
    travelDate: string
  ) {
    return this.http.get<SeatAvailabilityResponse>(
      'https://trainsapi.stepacademy.ge/api/seats/availability',
      {
        params: {
          scheduleId: scheduleId,
          coachId: coachId,
          travelDate: travelDate
        }
      }
    );
  }

  createBooking(booking: CreateBooking) {
    return this.http.post(
      'https://trainsapi.stepacademy.ge/api/bookings',
      booking
    );
  }

  getBookings(take: number = 10, page: number = 1) {
    return this.http.get<BookingsResponse>(
      `https://trainsapi.stepacademy.ge/api/bookings?Take=${take}&Page=${page}`
    );
  }

  deleteBooking(id: number) {
    return this.http.delete(
      `https://trainsapi.stepacademy.ge/api/bookings/${id}`
    );
  }

  getFilteredBookings(
    from: string,
    to: string,
    take: number = 10,
    page: number = 1
  ) {
    return this.http.get<BookingsResponse>(
      `https://trainsapi.stepacademy.ge/api/bookings/filter?from=${from}&to=${to}&Take=${take}&Page=${page}`
    );
  }

  getBookingById(id: number) {
    return this.http.get<BookingDetailsResponse>(
      `https://trainsapi.stepacademy.ge/api/bookings/${id}`
    );
  }

  changeBookingDate(
    id: number,
    data: UpdateBookingDateRequest
  ) {
    return this.http.put(
      `https://trainsapi.stepacademy.ge/api/bookings/${id}`,
      data
    );
  }

  sendBookingConfirmation(data: FormData) {
    return this.http.post(
      'http://localhost:5678/webhook/train-booking-confirmation',
      data
    );
  }

  sendAiMessage(
    message: string,
    history: string[],
    trainNumber: number | null,
    coachId: number | null,
    seatId: number | null,
    scheduleId: number | null,
    travelDate: string | null
  ) {
    const token =
      localStorage.getItem('accessToken') ??
      sessionStorage.getItem('accessToken');
    return this.http.post<AiResponse>(
      'http://localhost:5678/webhook/trains-ai-agent',
      {
        message: message,
        history: history,
        trainNumber: trainNumber,
        coachId: coachId,
        seatId,
        scheduleId,
        travelDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}