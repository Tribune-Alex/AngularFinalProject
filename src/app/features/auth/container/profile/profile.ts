import { Component, computed, effect, inject, signal } from '@angular/core';
import { Authservice } from '../../services/authservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserRequest } from '../../models/authmodels';
import { Trainservice } from '../../../trains/services/trainservice';

@Component({
  imports: [],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  private authService = inject(Authservice);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private trainService = inject(Trainservice);
  public firstName = signal('');
  public lastName = signal('');
  public email = signal('');
  public phoneNumber = signal('');
  public address = signal('');
  public pictureUrl = signal('');
  public dateOfBirth = signal('');
  public updateSuccess = signal(false);
  public updateError = signal('');
  public activeSection = signal<'profile' | 'bookings'>('profile');
  public fromDate = signal<string>('');
  public toDate = signal<string>('');
  public filterActive = signal<boolean>(false);
  public bookingToDelete = signal<number | null>(null);
  public selectedBookingId = signal<number | null>(null);
  public showChangeDate = signal<boolean>(false);
  public newTravelDate = signal<string>('');

  constructor() {
    effect(() => {
      const user = this.profile.value()?.data;

      if (!user) {
        return;
      }

      this.firstName.set(user.firstName);
      this.lastName.set(user.lastName);
      this.email.set(user.email);

      this.phoneNumber.set(
        user.details.phoneNumber ?? ''
      );

      this.address.set(
        user.details.address ?? ''
      );

      this.pictureUrl.set(
        user.details.pictureUrl ?? ''
      );

      this.dateOfBirth.set(
        user.details.dob
          ? user.details.dob.substring(0, 10)
          : ''
      );
    });
    const section = this.route.snapshot.queryParamMap.get('section');

    if (section === 'bookings') {
      this.activeSection.set('bookings');
    }
  }

  public profile = rxResource({
    stream: () => this.authService.getProfile()
  });

  public bookings = rxResource({
    stream: () => {
      return this.trainService.getBookings(10, 1);
    }
  });

  public filteredBookings = rxResource({
    params: () => {
      if (
        !this.filterActive() ||
        !this.fromDate() ||
        !this.toDate()
      ) {
        return undefined;
      }

      return {
        from: this.fromDate(),
        to: this.toDate()
      };
    },

    stream: ({ params }) => {
      return this.trainService.getFilteredBookings(
        params.from,
        params.to,
        10,
        1
      );
    }
  });

  public bookingDetails = rxResource({
    params: () => {
      const id = this.selectedBookingId();

      if (id === null) {
        return undefined;
      }

      return id;
    },

    stream: ({ params }) => {
      return this.trainService.getBookingById(params);
    }
  });

  public displayedBookings = computed(() => {
    if (this.filterActive()) {
      return this.filteredBookings.value()?.data.items ?? [];
    }

    return this.bookings.value()?.data.items ?? [];
  });

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.authService.isLoggedIn.set(false);

    this.router.navigate(['/']);
  }

  updateFirstName(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.firstName.set(input.value);
  }

  updateLastName(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.lastName.set(input.value);
  }

  updateEmail(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.email.set(input.value);
  }

  updatePhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.phoneNumber.set(input.value);
  }

  updateAddress(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.address.set(input.value);
  }

  updatePictureUrl(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.pictureUrl.set(input.value);
  }

  updateDateOfBirth(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dateOfBirth.set(input.value);
  }

  saveProfile(): void {

    this.updateSuccess.set(false);
    this.updateError.set('');
  
    if (
      !this.firstName().trim() ||
      !this.lastName().trim() ||
      !this.email().trim() ||
      !this.phoneNumber().trim() ||
      !this.address().trim() ||
      !this.pictureUrl().trim() ||
      !this.dateOfBirth()
    ) {
      this.updateError.set('Please fill in all fields.');
      return;
    }
  
    const data: UpdateUserRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phoneNumber: this.phoneNumber(),
      address: this.address(),
      pictureUrl: this.pictureUrl(),
      dateOfBirth: new Date(this.dateOfBirth()).toISOString()
    };
  
    this.authService.updateProfile(data).subscribe({
  
      next: (res) => {
        this.updateError.set('');
        this.updateSuccess.set(true);
      },
  
      error: (err) => {
        console.error('UPDATE ERROR:', err);
  
        this.updateSuccess.set(false);
  
        this.updateError.set(
          err.error?.detail ?? 'Failed to update profile. Please try again.'
        );
      }
  
    });
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
    this.activeSection.set('profile');
  }

  openBookings(): void {
    this.activeSection.set('bookings');
  }

  updateFromDate(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.fromDate.set(input.value);
  }

  updateToDate(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.toDate.set(input.value);
  }

  applyBookingFilter(): void {
    if (!this.fromDate() || !this.toDate()) {
      return;
    }

    this.filterActive.set(true);
  }

  clearBookingFilter(): void {
    this.fromDate.set('');
    this.toDate.set('');
    this.filterActive.set(false);
  }

  updateNewTravelDate(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    this.newTravelDate.set(input.value);
  }
  
  cancelChangeDate(): void {
    this.showChangeDate.set(false);
    this.newTravelDate.set('');
  }

  openDeleteBooking(id: number): void {
    this.bookingToDelete.set(id);
  }

  cancelDeleteBooking(): void {
    this.bookingToDelete.set(null);
  }

  deleteBooking(id: number): void {
    this.trainService.deleteBooking(id).subscribe({
      next: (response) => {
        console.log('BOOKING DELETED:', response);
        this.bookingToDelete.set(null);
        this.selectedBookingId.set(null);
        this.bookings.reload();

        if (this.filterActive()) {
          this.filteredBookings.reload();
        }
      },

      error: (error) => {
        console.error('DELETE BOOKING ERROR:', error);
      }
    });
  }

  openBookingDetails(id: number): void {
    this.selectedBookingId.set(id);
  }

  closeBookingDetails(): void {
    this.selectedBookingId.set(null);
  }

  openChangeDate(): void {
    const currentDate = this.bookingDetails.value()?.data.travelDate;
  
    if (!currentDate) {
      return;
    }
  
    this.newTravelDate.set(
      currentDate.substring(0, 10)
    );
  
    this.showChangeDate.set(true);
  }

  saveNewTravelDate(): void {
    const bookingId = this.selectedBookingId();
    const date = this.newTravelDate();
  
    if (bookingId === null || !date) {
      return;
    }
  
    const data = {
      travelDate: new Date(date).toISOString()
    };
  
    this.trainService.changeBookingDate(
      bookingId,
      data
    ).subscribe({
      next: (response) => {
        console.log('BOOKING DATE UPDATED:', response);
  
        this.showChangeDate.set(false);
        this.newTravelDate.set('');
  
        this.bookingDetails.reload();
        this.bookings.reload();
  
        if (this.filterActive()) {
          this.filteredBookings.reload();
        }
      },
  
      error: (error) => {
        console.error('CHANGE DATE ERROR:', error);
      }
    });
  }
}
