import { inject, Service, signal } from '@angular/core';
import { StationsResponse, Train, TrainDetailsResponse, TrainsResponse } from '../models/trainmodels';
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
}