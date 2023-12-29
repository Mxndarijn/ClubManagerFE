import { Routes } from '@angular/router';
import { SecretComponent } from './secret/secret.component';
import { AuthGuard } from './helpers/auth.guard.spec';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
    {
        path: '',
        component: SecretComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'login',
        component: LoginPageComponent
    }
];
