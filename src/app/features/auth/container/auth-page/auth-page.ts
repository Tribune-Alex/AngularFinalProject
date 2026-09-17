import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Register } from '../../components/register/register';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyEmailRequest } from '../../models/authmodels';
import { Authservice } from '../../services/authservice';
import { VerifyEmail } from '../../components/verify-email/verify-email';
import { Traincomponents } from "../../../trains/container/traincomponents/traincomponents";
import { Login } from '../../components/login/login';
import { ForgotPassword } from '../../components/forgot-password/forgot-password';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../../components/reset-password/reset-password';

@Component({
  imports: [Register, VerifyEmail, Login, ForgotPassword, ResetPassword],
  selector: 'app-auth-page',
  styleUrl: './auth-page.scss',
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private authService = inject(Authservice);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public registerData = signal<RegisterRequest | null>(null);
  public showVerify = signal(false);
  public authCompleted = signal(!!localStorage.getItem('accessToken'));
  public showLogin = signal(true);
  public showForgotPassword = signal(false);
  public forgotPasswordSent = signal(false);
  public forgotPasswordError = signal('');
  public resetToken = signal('');
  public registerError = signal('');
  public returnUrl = signal('');
  public verifyError = signal('');
  public loginError = signal('');
  public loginSuccess = signal(false);


  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl) {
      this.returnUrl.set(returnUrl);
    }

    if (token) {
      this.resetToken.set(token);
    }

    if (this.route.snapshot.routeConfig?.path === 'auth/register') {
      this.showLogin.set(false);
    }
  }


  registerUser(data: RegisterRequest): void {

    this.registerError.set('');
    this.registerData.set(data);
  
    this.authService.register(data).subscribe({
  
      next: (res) => {
        console.log('REGISTER RESPONSE:', res);
  
        this.registerError.set('');
        this.showVerify.set(true);
      },
  
      error: (err) => {
        console.log('REGISTER ERROR:', err);
  
        if (err.error?.detail === 'Email is already registered.') {
  
          this.registerError.set(
            'An account with this email already exists.'
          );
  
        } else {
  
          this.registerError.set(
            err.error?.detail ?? 'Registration failed. Please try again.'
          );
  
        }
      }
  
    });
  }

  verifyEmail(data: VerifyEmailRequest): void {

    this.verifyError.set('');
  
    const request: VerifyEmailRequest = {
      email: this.registerData()?.email ?? '',
      code: data.code
    };
  
    this.authService.verifyEmail(request).subscribe({
  
      next: (res) => {
  
        localStorage.setItem(
          'accessToken',
          res.data.accessToken
        );
  
        localStorage.setItem(
          'refreshToken',
          res.data.refreshToken
        );
  
        this.authService.isLoggedIn.set(true);
        this.authCompleted.set(true);
  
        this.verifyError.set('');
  
        console.log('TOKENS SAVED');
      },
  
      error: (err) => {
  
        console.log('VERIFY ERROR:', err);
  
        this.verifyError.set(
          err.error?.detail ?? 'Invalid verification code. Please try again.'
        );
      }
  
    });
  }

  loginUser(data: LoginRequest): void {

    this.loginError.set('');
  
    this.authService.login(data).subscribe({
  
      next: (res) => {
  
        localStorage.setItem(
          'accessToken',
          res.data.accessToken
        );
  
        localStorage.setItem(
          'refreshToken',
          res.data.refreshToken
        );
  
        this.authService.isLoggedIn.set(true);
  
        this.loginError.set('');
        this.loginSuccess.set(true);
  
        console.log('LOGIN TOKENS SAVED');
  
        
      },
  
      error: (err) => {
  
        console.log('LOGIN ERROR:', err);
  
        this.loginError.set(
          err.error?.detail ?? 'Invalid email or password.'
        );
      }
  
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
    this.authService.isLoggedIn.set(false);
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

  continueAfterLogin(): void {

    this.loginSuccess.set(false);
    this.authCompleted.set(true);
  
    if (this.returnUrl()) {
      this.router.navigateByUrl(this.returnUrl());
    } else {
      this.router.navigate(['/trains']);
    }
  }

}
