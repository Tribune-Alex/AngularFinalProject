import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../../services/authservice';

@Component({
  imports: [],
  selector: 'app-settings',
  styleUrl: './settings.scss',
  templateUrl: './settings.html',
})
export class Settings {
  public currentPassword = signal('');
  public newPassword = signal('');
  public confirmPassword = signal('');
  public passwordError = signal('');
  public passwordSuccess = signal('');
  public showDeleteConfirm = signal(false);
  private router = inject(Router);
  public authService = inject(Authservice);

  updateCurrentPassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentPassword.set(input.value);
  }

  updateNewPassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPassword.set(input.value);
  }

  updateConfirmPassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.confirmPassword.set(input.value);
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.authService.isLoggedIn.set(false);

    this.router.navigate(['/']);
  }

  changePassword(): void {
    this.passwordError.set('');
    this.passwordSuccess.set('');

    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('Passwords do not match');
      return;
    }

    this.authService.changePassword({
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword()
    }).subscribe({
      next: () => {
        this.passwordError.set('');
        this.passwordSuccess.set('Password changed successfully');
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
      },

      error: (err) => {
        console.error(err);

        const message =
          err.error?.detail ??
          'Password change failed';

        this.passwordError.set(message);
      }
    });
  }

  deleteAccount(): void {
    this.authService.deleteProfile().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
  
        this.authService.isLoggedIn.set(false);
  
        this.router.navigate(['/']);
      },
  
      error: (err) => {
        console.error('DELETE PROFILE ERROR:', err);
      }
    });
  }
}
