import { Component, inject, signal } from '@angular/core';
import { Trainservice } from '../../services/trainservice';
import { TrainCardComponents } from '../../components/train-card-components/train-card-components';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [TrainCardComponents],
  selector: 'app-traincomponents',
  styleUrl: './traincomponents.scss',
  templateUrl: './traincomponents.html',
})
export class Traincomponents {
  public trainService=inject(Trainservice)
  public selectedTrainId = signal<number>(1);
  query = signal<string | undefined>(undefined);
  public trains = rxResource({
    stream: () => this.trainService.getTrains(),
  });

  selectedTrain = rxResource({
    params: () => this.selectedTrainId(),
    stream: ({ params }) => this.trainService.getTrainById(params),
  });

  selectTrain(id: number): void {
    this.selectedTrainId.set(id);
  }



  

  searchNumber = rxResource({
    params: () => this.query(),
  
    stream: ({ params }) => {
      console.log('QUERY TO API:', params);
  
      return this.trainService.searchTrainByNumber(params);
    }
  });
  
  searchInput(keyword: string): void {
    console.log('INPUT:', keyword);
    this.query.set(keyword);
  }
}
