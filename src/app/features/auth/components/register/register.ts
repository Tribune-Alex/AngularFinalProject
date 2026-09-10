import { Component, output, signal } from '@angular/core';
import { RegisterRequest } from '../../models/authmodels';

@Component({
  imports: [],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  registerSubmit = output<RegisterRequest>();
  showLogin = output<void>();

  public firstName = signal('');
  public lastName = signal('');
  public email = signal('');
  public password = signal('');

  submitRegister(): void {

    const data: RegisterRequest = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password()
    };

    this.registerSubmit.emit(data);
  }

  openLogin(): void {
    this.showLogin.emit();
  }
}
