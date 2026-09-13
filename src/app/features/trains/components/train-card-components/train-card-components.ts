import { Component, input, output } from '@angular/core';
import { Schedule, Station, Train, TrainDetails } from '../../models/trainmodels';

@Component({
  imports: [],
  selector: 'app-train-card-components',
  styleUrl: './train-card-components.scss',
  templateUrl: './train-card-components.html',
})
export class TrainCardComponents {
  trains = input<Train[]>([])
  stations = input<Station[]>([]);
  toStations = input<Station[]>([]);
  selectedTrain = input<TrainDetails | null>(null)
  fromStationName = input<string>('');
  toStationName = input<string>('');
  transSelected = output<number>()
  search = output<string>();
  fromStationSelected = output<number>();
  fromStationNameSelected = output<string>();
  toStationSelected = output<number>();
  toStationNameSelected = output<string>();
  applyFilterSelected = output<void>();
  scheduleSearch = output<string>();
  scheduleResults = input<Schedule[]>([]);
  selectTrain(id: number): void {
    this.transSelected.emit(id)
  }
  searchTrain(keyword: string): void {
    this.search.emit(keyword);
  }
  selectFromStation(id: number): void {
    this.fromStationSelected.emit(id);
  }
  selectToStation(id: number): void {
    this.toStationSelected.emit(id);
  }
  selectFromStationName(name: string): void {
    this.fromStationNameSelected.emit(name);
  
    const station = this.stations().find(
      item => item.name === name
    );
  
    if (station) {
      this.fromStationSelected.emit(station.id);
    }
  }
  selectToStationName(name: string): void {
    this.toStationNameSelected.emit(name);
  }
  applyFilter(): void {
    this.applyFilterSelected.emit();
  }
}
