import { Component, input, output } from '@angular/core';
import { Train, TrainDetails } from '../../models/trainmodels';

@Component({
  imports: [],
  selector: 'app-train-card-components',
  styleUrl: './train-card-components.scss',
  templateUrl: './train-card-components.html',
})
export class TrainCardComponents {
  trains = input<Train[]>([])
  selectedTrain = input<TrainDetails | null>(null)
  transSelected = output<number>()
  search = output<string>();
  selectTrain(id: number): void {
    this.transSelected.emit(id)
  }
  searchTrain(keyword: string): void {
    this.search.emit(keyword);
  }
}
