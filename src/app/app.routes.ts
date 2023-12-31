import {Routes} from '@angular/router';
import {SecretComponent} from './secret/secret.component';
import {AuthGuard} from './helpers/auth.guard.spec';
import {HttpClientModule} from '@angular/common/http';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegisterPageComponent} from "./register-page/register-page.component";

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  }
];
