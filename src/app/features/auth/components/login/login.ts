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
  public showPassword = signal(false);
  public loginError = input<string>('');
  errorClosed = output<void>();
  public loginSuccess = input<boolean>(false);
  continueLogin = output<void>();
  public rememberMe = signal(false);
  loginSubmit = output<{
    data: LoginRequest;
    rememberMe: boolean;
  }>();
  showRegister = output<void>();
  forgotPassword = output<string>();

  submitLogin(): void {
    const data: LoginRequest = {
      email: this.email(),
      password: this.password()
    };
  
    this.loginSubmit.emit({
      data: data,
      rememberMe: this.rememberMe()
    });
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

  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  onRememberMeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    this.rememberMe.set(input.checked);
  }
}
