export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  export interface VerifyEmailRequest {
    email: string;
    code: string;
  }

  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface VerifyEmailResponse {
    data: AuthTokens;
  }
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    data: AuthTokens;
  }

  export interface ResetPasswordRequest {
    token: string;
    password: string;
  }