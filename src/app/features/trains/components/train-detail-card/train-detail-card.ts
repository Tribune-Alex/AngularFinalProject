import { Component, input, output, signal } from '@angular/core';
import { TrainDetails,Schedule, Coach } from '../../models/trainmodels';

@Component({
  imports: [],
  selector: 'app-train-detail-card',
  styleUrl: './train-detail-card.scss',
  templateUrl: './train-detail-card.html',
})
export class TrainDetailCard {
  train = input<TrainDetails | null>(null);
  schedules = input<Schedule[]>([]);
  coaches = input<Coach[]>([]);
  isLoggedIn = input<boolean>(false);
  selectedCoachClass = signal<string>('All');
  coachClassSelected = output<string>();
  coachSelected = output<number>();
  selectedScheduleId = signal<number | null>(null);
  scheduleSelected = output<number>();
  activeTab = signal<'schedules' | 'coaches'>('schedules');
}
