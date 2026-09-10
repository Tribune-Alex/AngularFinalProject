import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/container/auth-page/auth-page';
import { Traincomponents } from './features/trains/container/traincomponents/traincomponents';
import { Home } from './features/home/container/home/home';

export const routes: Routes = [

    {
      path: '',
      component: Home
    },
  
    {
      path: 'trains',
      component: Traincomponents
    },
  
    {
      path: 'auth',
      component: AuthPage
    },

    {
        path: 'auth/register',
        component: AuthPage
    },
  
    {
      path: 'auth/reset-password',
      component: AuthPage
    },
  
    {
      path: '**',
      redirectTo: ''
    }
  
  ];
