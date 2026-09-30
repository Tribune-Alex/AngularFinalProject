import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

    isLightMode = signal(false);

    toggleTheme() {
      this.isLightMode.update(value => !value);
  
      document.body.classList.toggle(
        'light-theme',
        this.isLightMode()
      );
    }

}