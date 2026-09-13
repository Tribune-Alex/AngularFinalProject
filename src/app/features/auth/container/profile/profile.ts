import { Component, effect, inject, signal } from '@angular/core';
import { Authservice } from '../../services/authservice';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UpdateUserRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  private authService = inject(Authservice);
  private router = inject(Router);
  public firstName = signal('');
  public lastName = signal('');
  public email = signal('');
  public phoneNumber = signal('');
  public address = signal('');
  public pictureUrl = signal('');
  public dateOfBirth = signal('');
  public updateSuccess = signal(false);

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
  }

  public profile = rxResource({
    stream: () => this.authService.getProfile()
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
    const data: UpdateUserRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phoneNumber: this.phoneNumber(),
      address: this.address(),
      pictureUrl: this.pictureUrl(),
      dateOfBirth: this.dateOfBirth()
        ? new Date(this.dateOfBirth()).toISOString()
        : ''
    };
  
    this.authService.updateProfile(data).subscribe({
      next: (res) => {
        this.updateSuccess.set(true);
      },
    
      error: (err) => {
        console.error('UPDATE ERROR:', err);
      }
    });
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }
}
