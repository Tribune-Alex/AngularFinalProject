import { Component, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.scss',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  public email = signal('');

  forgotSubmit = output<string>();
  backToLogin = output<void>();

  submitForgotPassword(): void {
    this.forgotSubmit.emit(this.email());
  }

  goBack(): void {
    this.backToLogin.emit();
  }
}
