import { inject, Service, signal } from '@angular/core';
import { Train, TrainDetailsResponse, TrainsResponse } from '../models/trainmodels';
import { HttpClient } from '@angular/common/http';

@Service()
export class Trainservice {
    public url:string="https://trainsapi.stepacademy.ge/api/trains"
    public searchUrl:string="https://trainsapi.stepacademy.ge/api/trains/search"
    

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
}