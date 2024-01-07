import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  constructor(private http: HttpClient,
              private auth: AuthenticationService) {}

  public sendGraphQLRequest(request: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      environment.apiUrl + '/graphql',
       request,
      { headers: headers, responseType: 'json' },
    );
  }

  public getMyAssociations(): Observable<any> {
    const query = {
      query: `
    {
      getMyAssociations {
        id,
        name,
        welcomeMessage,
        image {
          encoded
        },
        active,
        contactEmail
      }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }


}
