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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.checkAuthentication(state.url)
    return true;
  }

  private async checkAuthentication(targetUrl: string): Promise<void> {
    const [loggedIn, accountVerified] = await Promise.all([
      this.authService.isLoggedIn(),
      this.authService.isAccountVerified(),
    ]);

    if (!loggedIn) {
      await this.router.navigate(['/login'], {
        queryParams: { redirectUrl: targetUrl },
      });
    } else if (!accountVerified) {
      await this.router.navigate(['/email-verification']);
    }
  }
}
