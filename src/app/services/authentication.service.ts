import { Injectable } from '@angular/core';
import { AuthenticationClient } from '../../communication/authentication';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';

  constructor(
    private authenticationClient: AuthenticationClient,
    private router: Router
  ) { }

  public login(email: string, password: string): Observable<any> {
    return new Observable(subscriber => {
      this.authenticationClient.login(email, password).subscribe( {
        next: (response) => {
          if(response.success) {
            console.log("new token key: " + response.message)
            localStorage.setItem(this.tokenKey, response.message)
          }
          subscriber.next(response);
          subscriber.complete();
      },
        error: (error) => {
          console.error('Er is een fout opgetreden', error);
          subscriber.error(error);
        }
    });
  });
  }

  public register(email: string, password: string, fullName: string): Observable<any> {
    return new Observable(subscriber => {
      this.authenticationClient.register(email, password, fullName).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.message);
          }
          subscriber.next(response);
          subscriber.complete();
        },
        error: (error) => {
          console.error('Fout bij registreren', error);
          subscriber.error(error);
        }
      });
    });
  }


  public logout() {
    localStorage.removeItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
}
