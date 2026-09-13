import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainDetail } from './train-detail';

describe('TrainDetail', () => {
  let component: TrainDetail;
  let fixture: ComponentFixture<TrainDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
