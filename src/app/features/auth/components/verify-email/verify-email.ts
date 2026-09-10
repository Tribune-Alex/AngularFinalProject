import { Component, output, signal } from '@angular/core';
import { VerifyEmailRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-verify-email',
  styleUrl: './verify-email.scss',
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  public email = signal('');
  public code = signal('');

  verifySubmit = output<VerifyEmailRequest>();
  resendRequested = output<void>();

  submitVerify(): void {
    const data: VerifyEmailRequest = {
      email: this.email(),
      code: this.code()
    };

    this.verifySubmit.emit(data);
  }

  resendCode(): void {
    this.resendRequested.emit();
  }
}
