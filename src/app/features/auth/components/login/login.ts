import { Component, input, output, signal } from '@angular/core';
import { LoginRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  public email = signal('');
  public password = signal('');
  public loginError = input<string>('');
  errorClosed = output<void>();
  public loginSuccess = input<boolean>(false);
  continueLogin = output<void>();

  loginSubmit = output<LoginRequest>();
  showRegister = output<void>();
  forgotPassword = output<string>();

  submitLogin(): void {
    const data: LoginRequest = {
      email: this.email(),
      password: this.password()
    };

    this.loginSubmit.emit(data);
  }

  openRegister(): void {
    this.showRegister.emit();
  }

  requestPasswordReset(): void {
    this.forgotPassword.emit(this.email());
  }

  closeError(): void {
    this.errorClosed.emit();
  }

  continueAfterLogin(): void {
    this.continueLogin.emit();
  }
}
