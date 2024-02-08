import {environment} from '../../environment/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {AssociationInvite, AssociationInviteID} from "../../model/association-invite";
import {query} from "@angular/animations";
import {WeaponStatusInterface} from "../modals/create-weapon-modal/create-weapon-modal.component";
import {WeaponType} from "../../model/weapon-type.model";
import {addMonths, subMonths } from 'date-fns';
import {UtilityFunctions} from "../helpers/utility-functions";
import {WeaponMaintenance} from "../../model/weapon-maintenance.model";
import {Track} from "../../model/track.model";

@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  constructor(private http: HttpClient,
              private util: UtilityFunctions) {
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

  public getMyFullProfile(): Observable<any> {
    const query = {
      query: `
    {
      getMyProfile {
        id
        image {
            id,
            encoded
        },
        fullName,
        email
    }
    }
  `
    };
    return this.sendGraphQLRequest(query);

  }

  updateProfile(name: string | null, email: string | null, newPassword: string | null, currentPassword: string | null) {
    const query = {
      query: `
      mutation updateMyProfile($dto: UpdateMyProfileDTO!) {
  updateMyProfile(dto: $dto) {
    success,
    message
  }
}
    `,
      variables: {
        dto: {
          fullName: name,
          email: email,
          oldPassword: currentPassword,
          newPassword: newPassword,
        }
      }
    };
    return this.sendGraphQLRequest(query);
  }

  getAssociationSettings(associationID: string) {
  const query = {
    query: `
     query getAssociationDetails($associationID: ID!) {
     getAssociationDetails(associationID: $associationID) {
        name,
        image {
          encoded
        },
        welcomeMessage,
        contactEmail
    }
      }
    `,
    variables: {
      associationID: associationID
    }
  };
  return this.sendGraphQLRequest(query);
}

  getAssociationStatistics(associationID: string) {
    const query = {
      query: `
     query getAssociationStatistics($associationID: ID!) {
     getAssociationStatistics(associationID: $associationID) {
        totalMembers,
        totalTracks,
        totalWeapons
    }
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);
  }

  updateAssociationPicture(associationID: string, dataURL: string) {
  const query = {
    query: `
      mutation updateAssociationPicture($dto: ChangeProfilePictureDTO!, $associationID: ID!) {
  updateAssociationPicture(dto: $dto, associationID: $associationID) {
    success,
    message
  }
}
    `,
    variables: {
      dto: {
        image: dataURL,
      },
      associationID: associationID
    }
  };
  return this.sendGraphQLRequest(query);
}

  updateAssociationSettings(associationName: string, associationDescription: string, email: string, associationID: string) {

    const query = {
      query: `
        mutation updateAssociationSettings($dto: UpdateAssociationDTO!, $associationID: ID!) {
          updateAssociationSettings(dto: $dto, associationID: $associationID) {
            success,
            message
          }
        }
      `,
      variables: {
        dto: {
          associationName: associationName,
          welcomeMessage: associationDescription,
          contactEmail: email
        },
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getAllWeapons(associationID: string) {
    const query = {
      query: `
     query getAllWeapons($associationID: ID!) {
     getAllWeapons(associationID: $associationID) {
        id,
        name,
        type {
          id,
          name
        }
        status
    }
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getAllWeaponTypes(associationID: string)  {
    const query = {
      query: `
     query getAllWeaponTypes($associationID: ID!) {
     getAllWeaponTypes(associationID: $associationID) {
        id,
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

  createWeapon(associationID: string, weaponName: string, weaponStatusInterface: WeaponStatusInterface, weaponType: WeaponType) {
    const query = {
      query: `
         mutation createWeapon($dto: CreateWeaponDTO!, $associationID: ID!) {
          createWeapon(dto: $dto, associationID: $associationID) {
            success,
            message,
            weapon {
              id,
              name,
              type {
                id,
                name
              }
              status,
            }
          }
        }
      `,
      variables: {
        dto: {
          weaponName: weaponName,
          weaponType: weaponType.id,
          weaponStatus: weaponStatusInterface.id
        },
        associationID: associationID
      }
    };
    return this.sendGraphQLRequest(query);
  }

  getAssociationMaintenances(associationID: string, focusDate: Date): Observable<any> {
    const startDate = subMonths(focusDate, 1);
    const endDate = addMonths(focusDate, 1);

    const query = {
      query: `
      query getWeaponMaintenancesBetween($a: ID!, $start: LocalDateTime!, $end: LocalDateTime!){
    getWeaponMaintenancesBetween(associationID: $a, startDate: $start, endDate: $end) {
    success,
    maintenances {
        id,
        association {
            id,
            name
        },
        weapon {
          id,
          name,
          type {
            name
          }
        }
        startDate,
        endDate,
        title,
        colorPreset {
            id,
            colorName,
            primaryColor,
            secondaryColor
        },
        description
    }
    }
}
    `,
      variables: {
        a: associationID,
        start: this.util.toLocalIsoDateTime(startDate),
        end: this.util.toLocalIsoDateTime(endDate),
      }
    };
    return this.sendGraphQLRequest(query);

  }

  getAllColorPresets() {
    const query = {
      query: `
     query getAllColorPresets {
     getAllColorPresets {
        id,
        colorName,
        primaryColor,
        secondaryColor
    }
      }
    `
    };
    return this.sendGraphQLRequest(query);
  }

  createWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation createWeaponMaintenance($dto: CreateWeaponMaintenanceDTO!) {
          createWeaponMaintenance(dto: $dto) {
            success,
            message,
            maintenance {
               id,
        association {
            id,
            name
        },
        weapon {
          id,
          name,
          type {
            name
          }
        }
        startDate,
        endDate,
        title,
        colorPreset {
            id,
            colorName,
            primaryColor,
            secondaryColor
        },
        description
            }
          }
        }
      `,
      variables: {
        dto: {
          weaponUUID: currentWeaponMaintenance.weapon?.id,
          colorPresetUUID: currentWeaponMaintenance.colorPreset?.id,
          title: currentWeaponMaintenance.title,
          description: currentWeaponMaintenance.description,
          startDate: this.util.toLocalIsoDateTime(new Date(currentWeaponMaintenance.startDate!)),
          endDate: this.util.toLocalIsoDateTime(new Date(currentWeaponMaintenance.endDate!)),
          associationUUID: associationID,
        },
      }
    };

    return this.sendGraphQLRequest(query);

  }

  changeWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation changeWeaponMaintenance($dto: ChangeWeaponMaintenanceDTO!) {
          changeWeaponMaintenance(dto: $dto) {
            success,
            message,
            maintenance {
               id,
        association {
            id,
            name
        },
        weapon {
          id,
          name,
          type {
            name
          }
        }
        startDate,
        endDate,
        title,
        colorPreset {
            id,
            colorName,
            primaryColor,
            secondaryColor
        },
        description
            }
          }
        }
      `,
      variables: {
        dto: {
          weaponUUID: currentWeaponMaintenance.weapon?.id,
          colorPresetUUID: currentWeaponMaintenance.colorPreset?.id,
          weaponMaintenanceUUID: currentWeaponMaintenance.id,
          title: currentWeaponMaintenance.title,
          description: currentWeaponMaintenance.description,
          startDate: this.util.toLocalIsoDateTime(new Date(currentWeaponMaintenance.startDate!)),
          endDate: this.util.toLocalIsoDateTime(new Date(currentWeaponMaintenance.endDate!)),
          associationUUID: associationID,
        },
      }
    };

    return this.sendGraphQLRequest(query);
  }

  deleteWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation deleteWeaponMaintenance($dto: ID!, $associationID: ID!) {
          deleteWeaponMaintenance(maintenanceID: $dto, associationID: $associationID) {
            success,
            message,
          }
        }
      `,
      variables: {
        dto: currentWeaponMaintenance.id,
        associationID: associationID,
      }
    };

    return this.sendGraphQLRequest(query);
  }

  createTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation createTrackForAssociation($dto: TrackDTO!, $associationID: ID!) {
          createTrackForAssociation(dto: $dto, associationID: $associationID) {
            success,
            message,
            track {
              id,
              name,
              description,
              association {
                id
              },
              allowedWeaponTypes {
                id,
                name
              }
            }
          }
        }
      `,
      variables: {
        dto: {
          name: track.name,
          description: track.description,
          allowedWeaponTypes: track.allowedWeaponTypes.map(e => { return e.id})
        },
        associationID: associationID,
      }
    };

    return this.sendGraphQLRequest(query);
  }

  editTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation editTrackForAssociation($dto: TrackDTO!, $associationID: ID!, $trackID: ID!) {
          editTrackForAssociation(dto: $dto, associationID: $associationID, trackID: $trackID) {
            success,
            message,
            track {
              id,
              name,
              description,
              association {
                id
              },
              allowedWeaponTypes {
                id,
                name
              }
            }
          }
        }
      `,
      variables: {
        dto: {
          name: track.name,
          description: track.description,
          allowedWeaponTypes: track.allowedWeaponTypes.map(e => { return e.id})
        },
        associationID: associationID,
        trackID: track.id
      }
    };

    return this.sendGraphQLRequest(query);
  }

  deleteTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation deleteTrackForAssociation($associationID: ID!, $trackID: ID!) {
          deleteTrackForAssociation(associationID: $associationID, trackID: $trackID) {
            success,
            message,
          }
        }
      `,
      variables: {
        associationID: associationID,
        trackID: track.id
      }
    };

    return this.sendGraphQLRequest(query);
  }

  getTracksOfAssociation(associationID: string) {
    const query = {
      query: `
        query getTracksOfAssociation($associationID: ID!) {
          getTracksOfAssociation(associationID: $associationID) {
            id,
            name,
            description,
            association {
              id
            },
            allowedWeaponTypes {
              id,
              name
            }
          }
        }
      `,
      variables: {
        associationID: associationID,
      }
    };

    return this.sendGraphQLRequest(query);
  }
}
