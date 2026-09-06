import { inject, Service, signal } from '@angular/core';
import { Train } from '../models/trainmodels';
import { HttpClient } from '@angular/common/http';

@Service()
export class Trainservice {
    public url:string="https://trainsapi.stepacademy.ge/api/trains"
    public trainget=signal<Train[]>([])

    private http=inject(HttpClient)

    constructor(){
        this.http.get<Train[]>(this.url).subscribe((data:Train[])=>{
            this.trainget.set(data)
        })
    }
}