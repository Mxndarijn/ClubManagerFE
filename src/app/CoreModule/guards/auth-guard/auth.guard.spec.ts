import {AuthenticationService} from '../../services/authentication.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot,} from '@angular/router';

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
    const [loggedIn, accountVerified] = await Promise.all([
      this.authService.isLoggedIn(),
      this.authService.isAccountVerified()
    ]);
    if (!loggedIn) {
      await this.router.navigate(['/login']);
      return false;
    }
    if (!accountVerified && loggedIn) {
      await this.router.navigate(['/email-verification']);
      return false;
    }


    return true;
  }
}
