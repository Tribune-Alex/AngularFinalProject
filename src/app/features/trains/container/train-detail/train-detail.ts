import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainservice } from '../../services/trainservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { TrainDetailCard } from '../../components/train-detail-card/train-detail-card';
import { Authservice } from '../../../auth/services/authservice';

@Component({
  imports: [TrainDetailCard],
  selector: 'app-train-detail',
  styleUrl: './train-detail.scss',
  templateUrl: './train-detail.html',
})
export class TrainDetail {
  private route=inject(ActivatedRoute)
  private trainService = inject(Trainservice);
  private router = inject(Router);
  public authService = inject(Authservice);

  public trainId = Number(this.route.snapshot.paramMap.get('id'));
  public selectedCoachClass = signal<string>('All');  

  public selectedTrain = rxResource({
    params: () => this.trainId,

    stream: ({ params }) => {
      return this.trainService.getTrainById(params);
    }
  });

  public schedules = rxResource({
    stream: () => {
      return this.trainService.getSchedules();
    }
  });


  public trainSchedules = computed(() => {
    const items = this.schedules.value()?.data.items ?? [];
  
    return items.filter(item => item.trainId === this.trainId);
  });


  public coaches = rxResource({
    params: () => this.trainId,
  
    stream: ({ params }) => {
      return this.trainService.getCoachesByTrainId(params);
    }
  });

  selectCoachClass(value: string): void {
    this.selectedCoachClass.set(value);
  }
 

  public filteredCoaches = rxResource({
    params: () => {
      const coachClass = this.selectedCoachClass();
  
      if (coachClass === 'All') {
        return undefined;
      }
  
      return {
        trainId: this.trainId,
        coachClass
      };
    },
  
    stream: ({ params }) => {
      return this.trainService.filterCoaches(
        params.trainId,
        Number(params.coachClass)
      );
    }
  });

  selectCoach(coachId: number): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(
        ['/auth'],
        {
          queryParams: {
            returnUrl: `/booking/${this.trainId}/${coachId}`
          }
        }
      );
    
      return;
    }
  
    this.router.navigate([
      '/booking',
      this.trainId,
      coachId
    ]);
  }

  selectScheduleForBooking(scheduleId: number): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(
        ['/auth'],
        {
          queryParams: {
            returnUrl: `/booking-coach/${this.trainId}/${scheduleId}`
          }
        }
      );
    
      return;
    }
  
    this.router.navigate([
      '/booking-coach',
      this.trainId,
      scheduleId
    ]);
  }
}
