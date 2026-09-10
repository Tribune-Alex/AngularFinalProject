import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Register } from '../../components/register/register';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyEmailRequest } from '../../models/authmodels';
import { Authservice } from '../../services/authservice';
import { VerifyEmail } from '../../components/verify-email/verify-email';
import { Traincomponents } from "../../../trains/container/traincomponents/traincomponents";
import { Login } from '../../components/login/login';
import { ForgotPassword } from '../../components/forgot-password/forgot-password';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../../components/reset-password/reset-password';

@Component({
  imports: [Register, VerifyEmail, Traincomponents,Traincomponents,Login,ForgotPassword,ResetPassword],
  selector: 'app-auth-page',
  styleUrl: './auth-page.scss',
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private authService = inject(Authservice);
  private route = inject(ActivatedRoute);
  public registerData = signal<RegisterRequest | null>(null);
  public showVerify = signal(false);
  public authCompleted = signal(!!localStorage.getItem('accessToken'));
  public showLogin = signal(true);
  public showForgotPassword = signal(false);
  public forgotPasswordSent = signal(false);
  public forgotPasswordError = signal('');
  public resetToken = signal('');


  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
  
    if (token) {
      this.resetToken.set(token);
    }
  
    if (this.route.snapshot.routeConfig?.path === 'auth/register') {
      this.showLogin.set(false);
    }
  }


  registerUser(data: RegisterRequest): void {
    this.registerData.set(data);
  
    this.authService.register(data).subscribe(res => {
      console.log('REGISTER RESPONSE:', res);
  
      this.showVerify.set(true);
    });
  }

  verifyEmail(data: VerifyEmailRequest): void {
    const request: VerifyEmailRequest = {
      email: this.registerData()?.email ?? '',
      code: data.code
    };
  
    this.authService.verifyEmail(request).subscribe(res => {
  
      localStorage.setItem(
        'accessToken',
        res.data.accessToken
      );
  
      localStorage.setItem(
        'refreshToken',
        res.data.refreshToken
      );

      this.authCompleted.set(true);
  
      console.log('TOKENS SAVED');
    });
  }

  loginUser(data: LoginRequest): void {
    this.authService.login(data).subscribe(res => {
  
      localStorage.setItem(
        'accessToken',
        res.data.accessToken
      );
  
      localStorage.setItem(
        'refreshToken',
        res.data.refreshToken
      );

      this.authCompleted.set(true);
  
      console.log('LOGIN TOKENS SAVED');
    });
  }

  openRegister(): void {
    this.showLogin.set(false);
  }

  openLogin(): void {
    this.showLogin.set(true);
    this.showForgotPassword.set(false);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  
    this.authCompleted.set(false);
    this.showLogin.set(true);
    this.showVerify.set(false);
  }

  resendVerification(): void {
    const email = this.registerData()?.email ?? '';
  
    this.authService.resendVerification(email).subscribe(res => {
      console.log('VERIFICATION CODE RESENT:', res);
    });
  }

  forgetPassword(email: string): void {
    this.forgotPasswordError.set('');
  
    this.authService.forgetPassword(email).subscribe({
      next: (res) => {
        console.log('FORGET PASSWORD RESPONSE:', res);
  
        this.forgotPasswordSent.set(true);
      },
  
      error: (err) => {
        console.log('FORGET PASSWORD ERROR:', err);
  
        this.forgotPasswordSent.set(false);
        this.forgotPasswordError.set(
          'Something went wrong. Please check your email.'
        );
      }
    });
  }

  openForgotPassword(): void {
    this.forgotPasswordSent.set(false);
    this.showForgotPassword.set(true);
  }

  resetPassword(data: ResetPasswordRequest): void {
    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        console.log('RESET PASSWORD RESPONSE:', res);
  
        this.resetToken.set('');
        this.showLogin.set(true);
        this.showForgotPassword.set(false);
      },
  
      error: (err) => {
        console.log('RESET PASSWORD ERROR:', err);
      }
    });
  }
  
}
