import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Traincomponents } from "./features/trains/container/traincomponents/traincomponents";
import { TrainCardComponents } from "./features/trains/components/train-card-components/train-card-components";

@Component({
  imports: [Traincomponents],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Train');
}
