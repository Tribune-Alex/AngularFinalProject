import { Component, input, output, signal } from '@angular/core';
import { TrainDetails, Schedule, Coach } from '../../models/trainmodels';

@Component({
  imports: [],
  selector: 'app-train-detail-card',
  styleUrl: './train-detail-card.scss',
  templateUrl: './train-detail-card.html',
})
export class TrainDetailCard {
  public train = input<TrainDetails | null>(null);
  public schedules = input<Schedule[]>([]);
  public coaches = input<Coach[]>([]);
  public isLoggedIn = input<boolean>(false);
  public schedulesLoading = input<boolean>(false);
  public coachesLoading = input<boolean>(false);
  public selectedCoachClass = signal<string>('All');
  public coachClassSelected = output<string>();
  public coachSelected = output<number>();
  public selectedScheduleId = signal<number | null>(null);
  public scheduleSelected = output<number>();
  public activeTab = signal<'schedules' | 'coaches'>('schedules');
}
