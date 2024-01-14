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
      getMyProfile {
        associations {
            association {
                id
                name
                welcomeMessage
                contactEmail
                active
                image {
                    id
                    encoded
                }
            }
        }
      }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  public getMyPermissions(): Observable<any> {
    const query = {
      query: `
    {
      getMyProfile {
        role {
            permissions {
                name
            }
        }
    }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  public getMyAssociationPermissions(): Observable<any> {
    const query = {
      query: `
    {
      getMyProfile {
        associations {
            associationRole {
                permissions {
                    id
                    name
                    description
                }
            }
            association {
                id
                name
            }
        }
    }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  public getMyProfile(): Observable<any> {
    const query = {
      query: `
    {
      getMyProfile {
        id
        image {
            id,
            encoded
        }
    }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }


}
