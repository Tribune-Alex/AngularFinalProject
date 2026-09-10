import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink,RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  public isLoggedIn = signal(
    !!localStorage.getItem('accessToken')
  );
  public isHome(): boolean {
    return this.router.url === '/';
  }
  
  public isTrains(): boolean {
    return this.router.url.startsWith('/trains');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  
    this.isLoggedIn.set(false);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goTrains(): void {
    this.router.navigate(['/trains']);
  }

  goLogin(): void {
    this.router.navigate(['/auth']);
  }

  goRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
