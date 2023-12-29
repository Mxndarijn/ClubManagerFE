import { Injectable } from '@angular/core';
import { AuthenticationClient } from '../../communication/authentication';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';

  constructor(
    private authenticationClient: AuthenticationClient,
    private router: Router
  ) {}

  public login(email: string, password: string): void {
    this.authenticationClient.login(email, password).subscribe((response) => {
        // Controleer cookies in de responsheaders
        console.log(JSON.stringify(response))
        if(response.loggedIn) {
          localStorage.setItem(this.tokenKey, response.token)
          console.log("Ingelogd")
        }
      },
      (error) => {
        // Handel fouten af
        console.error('Fout bij inloggen', error);
      });
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    // this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
}
