import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GraphQLCommunication} from "./graphql-communication.service";
import {DefaultBooleanResponseDTO} from "../models/dto/default-boolean-response-dto";
import {LoginResponseDTO} from "../models/dto/login-response-dto";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token';
  private userKey = 'userID';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private graphQLService: GraphQLCommunication
  ) { }

  public login(email: string, password: string): Observable<any> {
    return new Observable(subscriber => {
      this.graphQLService.login(email, password).then((dto: LoginResponseDTO) => {
          if(dto.success) {
            console.log(dto)
            localStorage.setItem(this.tokenKey, dto.message)
            localStorage.setItem(this.refreshTokenKey, dto.refreshToken)
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
    localStorage.removeItem(this.refreshTokenKey);
  }

  public async isLoggedIn(): Promise<boolean> {
    let token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    try {
      const response = await this.graphQLService.validateToken();
      if(response.success == false) {
        return await this.refreshToken();
      }
      return response.success;
    } catch (error) {
      return false;
    }
  }

  public async isAccountVerified(): Promise<boolean> {
    let token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    try {
      const response = await this.graphQLService.isAccountVerified();
      return response.hasEmailVerified;
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

  setToken(token : string) {
    localStorage.setItem(this.tokenKey, token);

  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private isRefreshing: Promise<boolean> | null = null;

  async refreshToken(): Promise<boolean> {
    // Controleer of er al een refresh bezig is
    if (this.isRefreshing) {
      return this.isRefreshing; // Geef dezelfde Promise terug aan andere aanroepen
    }

    // Begin met een nieuwe refresh en sla de Promise op
    this.isRefreshing = new Promise<boolean>(async (resolve) => {
      let token = localStorage.getItem(this.refreshTokenKey);
      if (!token) {
        console.log("no refresh token stored");
        resolve(false);
        this.isRefreshing = null; // Reset de lock
        return;
      }

      try {
        const response: LoginResponseDTO = await this.graphQLService.refreshToken(token);
        if (response.success) {
          console.log("Token refreshed!")
          localStorage.setItem(this.tokenKey, response.message);
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        }

        resolve(response.success);
      } catch (error) {
        resolve(false);
      } finally {
        this.isRefreshing = null; // Reset de lock na voltooiing
      }
    });

    return this.isRefreshing; // Return de lock-Promise voor alle aanroepen
  }
}
