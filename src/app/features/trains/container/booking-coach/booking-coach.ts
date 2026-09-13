import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainservice } from '../../services/trainservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { Authservice } from '../../../auth/services/authservice';

@Component({
  imports: [],
  selector: 'app-booking-coach',
  styleUrl: './booking-coach.scss',
  templateUrl: './booking-coach.html',
})
export class BookingCoach {
  private route = inject(ActivatedRoute);
  private trainService = inject(Trainservice);
  private router = inject(Router);
  private authService = inject(Authservice);

  public trainId = Number(
    this.route.snapshot.paramMap.get('trainId')
  );

  public scheduleId = Number(
    this.route.snapshot.paramMap.get('scheduleId')
  );

  constructor() {
    console.log('TRAIN ID:', this.trainId);
    console.log('SCHEDULE ID:', this.scheduleId);
  }

  public coaches = rxResource({
    params: () => this.trainId,
    stream: ({ params }) => {
      return this.trainService.getCoachesByTrainId(params);
    }
  });

  selectCoach(coachId: number): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }
  
    this.router.navigate(
      ['/booking', this.trainId, coachId],
      {
        queryParams: {
          scheduleId: this.scheduleId
        }
      }
    );
  }
}
