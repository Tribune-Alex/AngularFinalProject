import { Component, input, output, signal } from '@angular/core';
import { ResetPasswordRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-reset-password',
  styleUrl: './reset-password.scss',
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  public token = input<string>('');

  public password = signal('');

  resetSubmit = output<ResetPasswordRequest>();

  submitReset(): void {
    const data: ResetPasswordRequest = {
      token: this.token(),
      password: this.password()
    };

    this.resetSubmit.emit(data);
  }
}
