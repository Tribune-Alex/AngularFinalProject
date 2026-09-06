import { TestBed } from '@angular/core/testing';
import { Trainservice } from './trainservice';

describe('Trainservice', () => {
  let service: Trainservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trainservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
