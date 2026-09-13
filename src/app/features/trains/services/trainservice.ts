import { inject, Service, signal } from '@angular/core';
import { CoachesResponse, SchedulesResponse, SeatAvailabilityResponse, SeatsResponse, StationsResponse, Train, TrainDetailsResponse, TrainsResponse } from '../models/trainmodels';
import { HttpClient, httpResource } from '@angular/common/http';

@Service()
export class Trainservice {
    public url:string="https://trainsapi.stepacademy.ge/api/trains"
    public searchUrl:string="https://trainsapi.stepacademy.ge/api/trains/search"
    public stationsUrl ='https://trainsapi.stepacademy.ge/api/stations';
    public fromStationId = signal<number | null>(null);
    

    private http=inject(HttpClient)

    
    getTrains(){
        return this.http.get<TrainsResponse>(this.url)
      }
      getTrainById(id:number){
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
}