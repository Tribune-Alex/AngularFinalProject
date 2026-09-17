import { Component, input, output, signal } from '@angular/core';
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
  public verifyError = input<string>('');

  verifySubmit = output<VerifyEmailRequest>();
  resendRequested = output<void>();
  errorClosed = output<void>();

  closeError(): void {
    this.errorClosed.emit();
  }

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
