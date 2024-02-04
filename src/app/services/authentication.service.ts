import { Injectable } from '@angular/core';
import { AuthenticationClient } from '../../communication/authentication';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {GraphQLCommunication} from "./graphql-communication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';
  private userKey = 'userID';

  constructor(
    private authenticationClient: AuthenticationClient,
    private router: Router,
    private graphQLService: GraphQLCommunication
  ) { }

  public login(email: string, password: string): Observable<any> {
    return new Observable(subscriber => {
      this.authenticationClient.login(email, password).subscribe( {
        next: (response) => {
          if(response.success) {
            localStorage.setItem(this.tokenKey, response.message)
            this.updateUserID();
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

  private updateUserID() {
    this.graphQLService.getMyID().subscribe({
      next: (idResponse) => {
        localStorage.setItem(this.userKey, idResponse.data.getMyProfile.id)
      }
    })
  }

  public register(email: string, password: string, fullName: string): Observable<any> {
    return new Observable(subscriber => {
      this.authenticationClient.register(email, password, fullName).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.message);
            this.updateUserID();
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
    localStorage.removeItem(this.userKey);
  }

  public async isLoggedIn(): Promise<boolean> {
    let token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    try {
      const response = await firstValueFrom(this.authenticationClient.validateToken());
      return response.success;
    } catch (error) {
      return false;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserID(): string | null {
    return localStorage.getItem(this.userKey);
  }
}
