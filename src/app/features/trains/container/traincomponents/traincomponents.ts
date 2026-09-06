import { Component, inject } from '@angular/core';
import { Trainservice } from '../../services/trainservice';
import { TrainCardComponents } from '../../components/train-card-components/train-card-components';

@Component({
  imports: [TrainCardComponents],
  selector: 'app-traincomponents',
  styleUrl: './traincomponents.scss',
  templateUrl: './traincomponents.html',
})
export class Traincomponents {
  public trainService=inject(Trainservice)
  public train=this.trainService.trainget
}
