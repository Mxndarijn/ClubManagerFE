import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  constructor(private http: HttpClient) {}

  public sendGraphQLRequest(request: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      environment.apiUrl + '/graphql',
      { request},
      { headers: headers, responseType: 'json' },
    );
  }

  public getMyAssociations(): Observable<any> {
    const query = `{
      getMyAssociations {
        id,
        name,
        welcomeMessage,
        image {
          encoded,
          id
        },
        active,
        contactEmail
      }
    }`;
    return this.sendGraphQLRequest(query);

  }


}
