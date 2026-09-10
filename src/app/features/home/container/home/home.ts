import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Trainservice } from '../../../trains/services/trainservice';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private router = inject(Router);

  public trainService = inject(Trainservice);

  public stations = this.trainService.stations;

  public fromStation = signal('');
  public toStation = signal('');

goTrains(): void {
  this.router.navigate(['/trains']);
}

goRegister(): void {
  this.router.navigate(['/auth/register']);
}

searchTrains(): void {
  this.router.navigate(['/trains'], {
    queryParams: {
      from: this.fromStation(),
      to: this.toStation()
    }
  });
}

}
