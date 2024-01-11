import {Routes} from '@angular/router';
import {SecretComponent} from './secret/secret.component';
import {AuthGuard} from './helpers/auth.guard.spec';
import {HttpClientModule} from '@angular/common/http';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {ReservationPageComponent} from "./pages/reservation-page/reservation-page.component";
import {VisitsPageComponent} from "./pages/visits-page/visits-page.component";
import {CompetitionPageComponent} from "./pages/competition-page/competition-page.component";

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
