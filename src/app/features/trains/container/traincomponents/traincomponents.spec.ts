import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Traincomponents } from './traincomponents';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('Traincomponents', () => {
  let component: Traincomponents;
  let fixture: ComponentFixture<Traincomponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Traincomponents],
      providers: [
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(Traincomponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should translate Georgian station name to English', () => {
    component.searchSchedule('თბილისი');
  
    expect(component.scheduleQuery()).toBe('Tbilisi');
  });
});
