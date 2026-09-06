import { Component, input } from '@angular/core';
import { Train } from '../../models/trainmodels';

@Component({
  imports: [],
  selector: 'app-train-card-components',
  styleUrl: './train-card-components.scss',
  templateUrl: './train-card-components.html',
})
export class TrainCardComponents {
  public gettrain=input.required<Train>()
}
