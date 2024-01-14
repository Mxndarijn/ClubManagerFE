import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationClient {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      environment.apiUrl + '/auth/login',
      { email, password },
      { headers: headers, responseType: 'json' },
    );
  }
  public register(email: string, password: string, fullName: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      environment.apiUrl + '/auth/register',
      { email, password, fullName},
      { headers: headers, responseType: 'json' },
    );
  }

  validateToken(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      environment.apiUrl + '/auth/validateToken',
      { },
      { headers: headers, responseType: 'json' },
    );
  }
}
