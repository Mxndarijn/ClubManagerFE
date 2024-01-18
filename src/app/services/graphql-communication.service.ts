import {environment} from '../../environment/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {AssociationInvite, AssociationInviteID} from "../../model/association-invite";

@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  constructor(private http: HttpClient) {
  }

  public sendGraphQLRequest(request: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(
      environment.apiUrl + '/graphql',
      request,
      {headers: headers, responseType: 'json'},
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

  public getMyID(): Observable<any> {
    const query = {
      query: `
    {
      getMyProfile {
        id
    }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  public getAssociationMembers(associationID: string): Observable<any> {
    const query = {
      query: `
      query GetAssociationMembers($associationID: ID!) {
        getAssociationDetails(associationID: $associationID) {
          users {
            user {
              id,
              fullName,
              email,
              image {
                encoded
              }
            },
            associationRole {
              name
            },
            memberSince
          }
        }
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);

  }

  public getAssociationRoles(): Observable<any> {
    const query = {
      query: `
      {
      getAssociationRoles {
    id,
    name
  }
      }
    `
    };
    return this.sendGraphQLRequest(query);

  }

  public changeUserAssociation(associationID: string, userID: string, roleID: string): Observable<any> {
    const query = {
      query: `
      mutation changeUserAssociation($changeUserAssociationDTO: ChangeUserAssociationDTO!) {
  changeUserAssociation(changeUserAssociationDTO: $changeUserAssociationDTO) {
    success,
    userAssociation {
      user {
        id,
        fullName,
        email,
        image {
          encoded
        }
      },
      associationRole {
        name
      },
      memberSince
    }
  }
}

    `,
      variables: {
        changeUserAssociationDTO: {
          userUUID: userID,
          associationUUID: associationID,
          associationRoleUUID: roleID
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }


  deleteUserAssociation(associationID: string, userID: string): Observable<any> {
    const query = {
      query: `
      mutation removeUserAssociation($deleteUserAssociationDTO: DeleteUserAssociationDTO!) {
  removeUserAssociation(deleteUserAssociationDTO: $deleteUserAssociationDTO) {
    success,
  }
}
    `,
      variables: {
        deleteUserAssociationDTO: {
          userUUID: userID,
          associationUUID: associationID,
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getAssociationInvites(associationID: string) {
    const query = {
    query: `
     query GetAssociationInvites($associationID: ID!) {
        getAssociationDetails(associationID: $associationID) {
          invites {
        id {
            userId,
            associationId
        },
        user {
            email
        },
        associationRole {
            name
        },
        createdAt
    }
      }
}
    `,
    variables: {
      associationID: associationID
    }
  };
  return this.sendGraphQLRequest(query);

}

  getUserInvites() {
    const query = {
      query: `
    {
      getMyProfile {
        invites {
        id {
        userId,
        associationId,
        }
        association {
            name
            contactEmail
            image {
                id
                encoded
            }
        }
        createdAt,
        associationRole {
          name
        }
        }
      }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  deleteAssociationInvite(id: AssociationInviteID): Observable<any> {
    const query = {
      query: `
      mutation removeAssociationInvite($inviteID: AssociationInviteInput!) {
  removeAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
}
    `,
      variables: {
        inviteID: {
          userUUID: id.userId,
          associationUUID: id.associationId,
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }

  createAssociationInvite(associationID: string, email: string, id: string): Observable<any> {
    const query = {
      query: `
      mutation sendAssociationInvite($dto: CreateAssociationInviteInput!) {
  sendAssociationInvite(dto: $dto) {
    success,
    message,
    associationInvite {
    id {
            userId,
            associationId
        },
        user {
            email
        },
        associationRole {
            name
        },
        createdAt
    }
    }
  }
    `,
      variables: {
        dto: {
          userEmail: email,
          associationUUID: associationID,
          associationRoleUUID: id
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getAssociationName(associationID: string) {
    const query = {
      query: `
     query GetAssociationInvites($associationID: ID!) {
        getAssociationDetails(associationID: $associationID) {
         name
      }
}
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);

  }

  acceptAssociationInvite(id: AssociationInviteID): Observable<any> {
    const query = {
      query: `
      mutation acceptAssociationInvite($inviteID: AssociationInviteInput!) {
  acceptAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
}
    `,
      variables: {
        inviteID: {
          userUUID: id.userId,
          associationUUID: id.associationId,
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }

  rejectAssociationInvite(id: AssociationInviteID): Observable<any> {
    const query = {
      query: `
      mutation rejectAssociationInvite($inviteID: AssociationInviteInput!) {
  rejectAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
}
    `,
      variables: {
        inviteID: {
          userUUID: id.userId,
          associationUUID: id.associationId,
        }
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getUserInviteCount() {
    const query = {
      query: `
    {
      getMyProfile {
        invites {
        id
        }
      }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  uploadProfilePicture(dataURL: string) {
    const query = {
      query: `
      mutation updateMyProfilePicture($dto: ChangeProfilePictureDTO!) {
  updateMyProfilePicture(dto: $dto) {
    success,
    message
  }
}
    `,
      variables: {
        dto: {
          image: dataURL,
        }
      }
    };
    return this.sendGraphQLRequest(query);
  }
}
