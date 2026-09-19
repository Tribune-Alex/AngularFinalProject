import { Component, input, output, signal } from '@angular/core';
import { RegisterRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  public registerSubmit = output<RegisterRequest>();
  public showLogin = output<void>();
  public passwordError = signal('');
  public showPassword = signal(false);
  public firstName = signal('');
  public lastName = signal('');
  public email = signal('');
  public password = signal('');
  public registerError = input<string>('');

  submitRegister(): void {

    const password = this.password();
  
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)) {
      this.passwordError.set(
        'Password must contain at least one special character.'
      );
      return;
    }
  
    this.passwordError.set('');
  
    const data: RegisterRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: password
    };
  
    this.registerSubmit.emit(data);
  }

  openLogin(): void {
    this.showLogin.emit();
  }

  onFirstNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.firstName.set(input.value);
  }

  onLastNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lastName.set(input.value);
  }

  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }
  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }
}
