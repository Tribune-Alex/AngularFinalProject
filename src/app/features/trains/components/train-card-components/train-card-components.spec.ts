import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainCardComponents } from './train-card-components';

describe('TrainCardComponents', () => {
  let component: TrainCardComponents;
  let fixture: ComponentFixture<TrainCardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainCardComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainCardComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
