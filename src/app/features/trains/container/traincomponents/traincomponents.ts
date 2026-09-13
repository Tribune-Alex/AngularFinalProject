import { Component, effect, inject, signal } from '@angular/core';
import { Trainservice } from '../../services/trainservice';
import { TrainCardComponents } from '../../components/train-card-components/train-card-components';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [TrainCardComponents],
  selector: 'app-traincomponents',
  styleUrl: './traincomponents.scss',
  templateUrl: './traincomponents.html',
})
export class Traincomponents {
  public trainService=inject(Trainservice);
  private route = inject(ActivatedRoute);
  private router=inject(Router)
  public stations = this.trainService.stations;
  public toStations = this.trainService.toStations;
  // public selectedTrainId = signal<number>(1);
  public query = signal<string | undefined>(undefined);
  public fromStationId = signal<number | null>(null);
  public fromStationName = signal<string>('');
  public toStationId = signal<number | null>(null);
  public toStationName = signal<string>('');
  public filterRequested = signal<number>(0);
  public filterActive = signal<boolean>(false);
  public scheduleQuery = signal<string>('');
  public trains = rxResource({
    stream: () => this.trainService.getTrains(),
  });

  // selectedTrain = rxResource({
  //   params: () => this.selectedTrainId(),
  //   stream: ({ params }) => this.trainService.getTrainById(params),
  // });

  selectTrain(id: number): void {
    this.router.navigate(['/train', id]);
  }

  constructor() {
    const from = this.route.snapshot.queryParamMap.get('from');
    const to = this.route.snapshot.queryParamMap.get('to');
  
    if (from && to) {
      this.fromStationName.set(from);
      this.toStationName.set(to);
  
      this.filterActive.set(true);
      this.filterRequested.update(value => value + 1);
  
      effect(() => {
        const stations = this.stations.value()?.data ?? [];
  
        const station = stations.find(
          item => item.name === from
        );
  
        if (station) {
          this.fromStationId.set(station.id);
          this.trainService.fromStationId.set(station.id);
        }
      });
    }
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

  selectFromStation(id: number): void {
    this.fromStationId.set(id);
    this.trainService.fromStationId.set(id);
  
    console.log('FROM STATION ID:', id);
  }

  selectToStation(id: number): void {
    this.toStationId.set(id);
  
    console.log('TO STATION ID:', id);
  }

  selectFromStationName(name: string): void {
    this.fromStationName.set(name);
  
    console.log('FROM STATION NAME:', name);
  }

  selectToStationName(name: string): void {
    this.toStationName.set(name);
  
    console.log('TO STATION NAME:', name);
  }

  applyFilter(): void {

    if (
      this.fromStationName() === 'Any origin' ||
      this.toStationName() === 'Any destination'
    ) {
      this.filterActive.set(false);
      return;
    }
  
    this.filterActive.set(true);
    this.filterRequested.update(value => value + 1);
  }

  public filteredTrains = rxResource({
    params: () => this.filterRequested(),
  
    stream: () => {
      return this.trainService.filterTrains(
        this.fromStationName(),
        this.toStationName()
      );
    }
  });

  public searchedSchedules = rxResource({
    params: () => {
      const query = this.scheduleQuery().trim();
  
      return query ? query : undefined;
    },
  
    stream: ({ params }) => {
      return this.trainService.searchSchedules(params);
    }
  });

  searchSchedule(value: string): void {
    this.scheduleQuery.set(value);
  }

 
}
