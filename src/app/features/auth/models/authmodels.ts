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

  export interface UserDetails {
    phoneNumber: string | null;
    address: string | null;
    dob: string | null;
    pictureUrl: string | null;
  }
  
  export interface UserProfile {
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    details: UserDetails;
  }
  
  export interface UserProfileResponse {
    data: UserProfile;
  }

  export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    pictureUrl: string;
    dateOfBirth: string;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }