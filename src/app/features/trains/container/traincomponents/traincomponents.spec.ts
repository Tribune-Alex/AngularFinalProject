import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Traincomponents } from './traincomponents';

describe('Traincomponents', () => {
  let component: Traincomponents;
  let fixture: ComponentFixture<Traincomponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Traincomponents],
    }).compileComponents();

    fixture = TestBed.createComponent(Traincomponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
