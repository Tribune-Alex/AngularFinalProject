import { Component, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Authservice } from '../../../features/auth/services/authservice';


@Component({
  imports: [RouterLink,RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  public authService = inject(Authservice);
  public isHome(): boolean {
    return this.router.url === '/';
  }
  
  public isTrains(): boolean {
    return this.router.url.startsWith('/trains');
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

  goProfile(): void {
    this.router.navigate(['/profile']);
  }
}
