import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/container/auth-page/auth-page';
import { Traincomponents } from './features/trains/container/traincomponents/traincomponents';
import { Home } from './features/home/container/home/home';
import { TrainDetail } from './features/trains/container/train-detail/train-detail';
import { BookingDate } from './features/trains/container/booking-date/booking-date';
import { BookingCoach } from './features/trains/container/booking-coach/booking-coach';
import { authGuard } from './features/auth/guards/auth.guard';
import { Profile } from './features/auth/container/profile/profile';
import { Settings } from './features/auth/container/settings/settings';

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
      path: 'profile',
      component: Profile,
      canActivate: [authGuard]
    },
  
    {
      path: 'auth/reset-password',
      component: AuthPage
    },
    {
      path: 'train/:id',
      component: TrainDetail
    },
    {
      path: 'booking-coach/:trainId/:scheduleId',
      component: BookingCoach,
      canActivate: [authGuard]
    },
    {
      path: 'booking/:trainId/:coachId',
      component: BookingDate,
      canActivate: [authGuard]
    },
    {
      path: 'settings',
      component: Settings,
      canActivate: [authGuard]
    },
  
    {
      path: '**',
      redirectTo: ''
    }
    
  
  ];
