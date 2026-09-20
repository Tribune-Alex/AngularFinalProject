import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Authservice } from '../../features/auth/services/authservice';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(Authservice);

  const token = authService.getAccessToken();

  const isN8nRequest = req.url.startsWith(
    'http://localhost:5678/'
  );
  
  if (isN8nRequest) {
    return next(req);
  }

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');

        authService.isLoggedIn.set(false);

        router.navigate(['/auth']);
      }

      return throwError(() => error);
    })
  );
};
