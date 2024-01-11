import {Routes} from '@angular/router';
import {SecretComponent} from './secret/secret.component';
import {AuthGuard} from './helpers/auth.guard.spec';
import {HttpClientModule} from '@angular/common/http';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegisterPageComponent} from "./register-page/register-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {ReservationPageComponent} from "./reservation-page/reservation-page.component";
import {VisitsPageComponent} from "./visits-page/visits-page.component";
import {CompetitionPageComponent} from "./competition-page/competition-page.component";

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reservations',
    component: ReservationPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visits',
    component: VisitsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'competition',
    component: CompetitionPageComponent,
    canActivate: [AuthGuard],
  }
];
