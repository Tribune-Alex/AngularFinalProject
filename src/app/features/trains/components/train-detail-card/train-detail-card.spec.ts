import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainDetailCard } from './train-detail-card';

describe('TrainDetailCard', () => {
  let component: TrainDetailCard;
  let fixture: ComponentFixture<TrainDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainDetailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainDetailCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
