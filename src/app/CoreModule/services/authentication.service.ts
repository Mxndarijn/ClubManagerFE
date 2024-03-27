import { Injectable } from '@angular/core';
import { AuthenticationClient } from '../../../communication/authentication';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {GraphQLCommunication} from "./graphql-communication.service";
import {
  DefaultBooleanResponseDTO,
  DefaultBooleanResponseWithAnyMessageDTO
} from "../models/dto/default-boolean-response-dto";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';
  private userKey = 'userID';

  constructor(
    private graphQLService: GraphQLCommunication
  ) { }

  public login(email: string, password: string): Observable<any> {
    return new Observable(subscriber => {
      this.graphQLService.login(email, password).subscribe( {
        next: (response) => {
          console.log(response)
          const dto = response.data.login as DefaultBooleanResponseWithAnyMessageDTO;
          if(dto.success) {
            localStorage.setItem(this.tokenKey, dto.message)
            this.updateUserID();
          }
          subscriber.next(dto);
          subscriber.complete();
      },
        error: (error) => {
          // console.error('Er is een fout opgetreden', error);
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
      this.graphQLService.register(email, password, fullName).subscribe({
        next: (response) => {
          const dto = response.data.register as DefaultBooleanResponseDTO;
          if (dto.success) {
            localStorage.setItem(this.tokenKey, dto.message);
            this.updateUserID();
          }
          subscriber.next(dto);
          subscriber.complete();
        },
        error: (error) => {
          // console.error('Fout bij registreren', error);
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
      const response = await firstValueFrom(this.graphQLService.validateToken());
      return response.data.validateToken.success;
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
