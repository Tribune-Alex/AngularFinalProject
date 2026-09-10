import { inject, Service, signal } from '@angular/core';
import { LoginRequest, LoginResponse, RegisterRequest,ResetPasswordRequest,VerifyEmailRequest, VerifyEmailResponse } from '../models/authmodels';
import { HttpClient } from '@angular/common/http';

@Service()
export class Authservice {
    private http = inject(HttpClient);

  public registerUrl ='https://trainsapi.stepacademy.ge/api/auth/register';
  public verifyEmailUrl ='https://trainsapi.stepacademy.ge/api/auth/verify-email';
  public loginUrl ='https://trainsapi.stepacademy.ge/api/auth/login';
  public resendVerificationUrl ='https://trainsapi.stepacademy.ge/api/auth/resend-email-verification';
  public forgetPasswordUrl ='https://trainsapi.stepacademy.ge/api/auth/forget-password';
  public resetPasswordUrl ='https://trainsapi.stepacademy.ge/api/auth/reset-password';

    register(data: RegisterRequest) {
        return this.http.post(
          this.registerUrl,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }


      verifyEmail(data: VerifyEmailRequest) {
        return this.http.put<VerifyEmailResponse>(
          this.verifyEmailUrl,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }


      login(data: LoginRequest) {
        return this.http.post<LoginResponse>(
          this.loginUrl,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      resendVerification(email: string) {
        return this.http.post(
          `${this.resendVerificationUrl}/${encodeURIComponent(email)}`,
          {}
        );
      }

      forgetPassword(email: string) {
        return this.http.post(
          `${this.forgetPasswordUrl}/${encodeURIComponent(email)}`,
          {}
        );
      }

      resetPassword(data: ResetPasswordRequest) {
        return this.http.put(
          this.resetPasswordUrl,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
}
