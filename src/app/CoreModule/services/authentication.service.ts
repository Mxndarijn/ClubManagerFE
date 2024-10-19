import {Injectable} from '@angular/core';
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
      this.graphQLService.login(email, password).then((dto: DefaultBooleanResponseWithAnyMessageDTO) => {
          if(dto.success) {
            localStorage.setItem(this.tokenKey, dto.message)
            this.updateUserID();
          }
          subscriber.next(dto);
          subscriber.complete();
    }).catch(e => {
        subscriber.error(e);
      });
  });
  }

  private updateUserID() {
    this.graphQLService.getMyID().then( r=>{
      console.log(r)
        localStorage.setItem(this.userKey, r.id)
    })
  }

  public register(email: string, password: string, fullName: string, language: string): Observable<any> {
    return new Observable(subscriber => {
      this.graphQLService.register(email, password, fullName, language).then((dto: DefaultBooleanResponseDTO) =>{
          if (dto.success) {
            localStorage.setItem(this.tokenKey, dto.message);
            this.updateUserID();
          }
          subscriber.next(dto);
          subscriber.complete();
      }).catch(e => subscriber.error(e));
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
      const response = await this.graphQLService.validateToken();
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
