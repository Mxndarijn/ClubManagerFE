
import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const loggedIn = await this.authService.isLoggedIn();
    console.log(loggedIn)
    if (!loggedIn) {
      await this.router.navigate(['/login']);
    }

    return true;
  }
}
