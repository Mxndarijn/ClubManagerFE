import {environment} from '../../../environment/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AssociationInviteID} from "../models/association-invite";
import {WeaponType} from "../models/weapon-type.model";
import {addMonths, subMonths} from 'date-fns';
import {UtilityFunctions} from "../../SharedModule/utilities/utility-functions";
import {WeaponMaintenance} from "../models/weapon-maintenance.model";
import {Track} from "../models/track.model";
import {Reservation, ReservationSeries} from "../models/reservation.model";
import {
  WeaponStatusInterface
} from "../../features/AssociationModule/modals/create-weapon-modal/create-weapon-modal.component";


@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  associationMutations = 0;
  associationQueries = 0;
  userQueries = 0;
  userMutations = 0;

  associationMemberMutations =0;
  associationReservationMutations =0;
  associationSettingsMutations =0;
  associationTrackMutations =0;
  associationWeaponMutations =0;
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

  public solvePromise(query: any, fun: (arg: any) => any) {
    return new Promise<any>((resolve, reject) => {
      this.sendGraphQLRequest(query).subscribe({
        next: (v) => {
          if(v.data === null || v.errors != null || fun(v) == null) {
            console.error(v);
          }
          resolve(fun(v))
        },
        error:(e) => {
          reject(e);
        }
      })
    })
  }

  public getMyAssociations(): Promise<any> {
    const query = {
      query: `
    {
  userQueries {
    getMyProfile {
      associations {
        association {
          id
          contactEmail
          active
          image {
            encoded
            id
          }
          name
          welcomeMessage
        }
      }
    }
  }
}
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  public getMyPermissions(): Promise<any> {
    const query = {
      query: `
    {
  userQueries {
    getMyProfile {
      role {
        permissions {
          name
        }
      }
    }
  }
}
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  public getMyAssociationPermissions(): Promise<any> {
    const query = {
      query: `
    {
      userQueries {
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
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  public getMyProfile(): Promise<any> {
    const query = {
      query: `
    {
      userQueries {
    getMyProfile {
        id
        image {
            id,
            encoded
        }
    }
  }
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  public getMyID(): Promise<any> {
    const query = {
      query: `
    {
      userQueries {
    getMyProfile {
        id
    }
  }
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  public getAssociationMembers(associationID: string): Promise<any> {
    const query = {
      query: `
      query GetAssociationMembers($associationID: ID!) {
        associationQueries {
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
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);

  }

  public getAssociationRoles(): Promise<any> {
    const query = {
      query: `
      {
      utilQueries {
    getAssociationRoles {
      id
      name
    }
  }
      }
    `
    };
    return this.solvePromise(query, v => v.data.utilQueries.getAssociationRoles);

  }

  public changeUserAssociation(associationID: string, userID: string, roleID: string): Promise<any> {
    const query = {
      query: `
      mutation changeUserAssociation($changeUserAssociationDTO: ChangeUserAssociationDTO!) {
  associationMutations {
    associationMemberMutations {
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.changeUserAssociation);

  }


  deleteUserAssociation(associationID: string, userID: string): Promise<any> {
    const query = {
      query: `
      mutation removeUserAssociation($deleteUserAssociationDTO: DeleteUserAssociationDTO!) {
      associationMutations {
    associationMemberMutations {
  removeUserAssociation(deleteUserAssociationDTO: $deleteUserAssociationDTO) {
    success,
  }
  }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.removeUserAssociation);

  }

  getAssociationInvites(associationID: string) {
    const query = {
      query: `
     query GetAssociationInvites($associationID: ID!) {
       associationQueries {
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
}
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);

  }

  getUserInvites() {
    const query = {
      query: `
    {
      userQueries {
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
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  deleteAssociationInvite(id: AssociationInviteID): Promise<any> {
    const query = {
      query: `
      associationMutations {
    associationMemberMutations {
      removeAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
    }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.removeAssociationInvite);

  }

  createAssociationInvite(associationID: string, email: string, id: string): Promise<any> {
    const query = {
      query: `
      mutation sendAssociationInvite($dto: CreateAssociationInviteInput!) {
  associationMutations {
    associationMemberMutations {
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.sendAssociationInvite);

  }

  getAssociationName(associationID: string) {
    const query = {
      query: `
     query GetAssociationInvites($associationID: ID!) {
        associationQueries {
    getAssociationDetails(associationID: $associationID) {
         name
      }
  }
}
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);

  }



  acceptAssociationInvite(id: AssociationInviteID): Promise<any> {
    const query = {
      query: `
      mutation acceptAssociationInvite($inviteID: AssociationInviteInput!) {
  associationMutations {
    associationMemberMutations {
      acceptAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
    }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.acceptAssociationInvite);

  }

  rejectAssociationInvite(id: AssociationInviteID): Promise<any> {
    const query = {
      query: `
      mutation rejectAssociationInvite($inviteID: AssociationInviteInput!) {
  associationMutations {
    associationMemberMutations {
      rejectAssociationInvite(inviteId: $inviteID) {
    success,
    message
  }
    }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.rejectAssociationInvite);

  }

  // getUserInviteCount() {
  //   const query = {
  //     query: `
  //   {
  //     getMyProfile {
  //       invites {
  //       id
  //       }
  //     }
  //   }
  // `
  //   };
  //   return this.sendGraphQLRequest(query);
  //
  // }

  uploadProfilePicture(dataURL: string) {
    const query = {
      query: `
      mutation updateMyProfilePicture($dto: ChangeProfilePictureDTO!) {
  userMutations {
    updateMyProfilePicture(dto: $dto) {
    success,
    message
  }
  }
}
    `,
      variables: {
        dto: {
          image: dataURL,
        }
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.userMutations.updateMyProfilePicture);
  }

  public getMyFullProfile(): Promise<any> {
    const query = {
      query: `
    {
      userQueries {
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
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);

  }

  updateProfile(name: string | null, email: string | null, newPassword: string | null, currentPassword: string | null) {
    const query = {
      query: `
      mutation updateMyProfile($dto: UpdateMyProfileDTO!) {
  userMutations {
    updateMyProfile(dto: $dto) {
    success,
    message
  }
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
    return this.solvePromise(query, v => v.data.userMutations.updateMyProfile);
  }

  getAssociationSettings(associationID: string) {
    const query = {
      query: `
     query getAssociationDetails($associationID: ID!) {
     associationQueries {
    getAssociationDetails(associationID: $associationID) {
        name,
        image {
          encoded
        },
        welcomeMessage,
        contactEmail
    }
  }
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);
  }

  getAssociationStatistics(associationID: string) {
    const query = {
      query: `
     query getAssociationStatistics($associationID: ID!) {
     associationQueries {
    getAssociationStatistics(associationID: $associationID) {
        totalMembers,
        totalTracks,
        totalWeapons
    }
  }
      }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationStatistics);
  }

  updateAssociationPicture(associationID: string, dataURL: string) {
    const query = {
      query: `
      mutation updateAssociationPicture($dto: ChangeProfilePictureDTO!, $associationID: ID!) {
  associationMutations {
    associationSettingsMutations {
      updateAssociationPicture(dto: $dto, associationID: $associationID) {
    success,
    message
  }
    }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationSettingsMutations.updateAssociationPicture);
  }

  updateAssociationSettings(associationName: string, associationDescription: string, email: string, associationID: string) {

    const query = {
      query: `
        mutation updateAssociationSettings($dto: UpdateAssociationDTO!, $associationID: ID!) {
          associationMutations {
    associationSettingsMutations {
      updateAssociationSettings(dto: $dto, associationID: $associationID) {
            success,
            message
          }
    }
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
    return this.solvePromise(query, v => v.data.associationMutations.associationSettingsMutations.updateAssociationSettings);

  }

  getAllWeapons(associationID: string) {
    const query = {
      query: `
     query getAllWeapons($associationID: ID!) {
     associationQueries {
    associationWeaponQueries {
    getAllWeapons(associationID: $associationID) {
      id
      name
      type {
        id
        name
      }
      status
    }
  }
  }
  }
    `,
      variables: {
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.associationWeaponQueries.getAllWeapons);

  }

  getAllWeaponTypes() {
    const query = {
      query: `
     query getAllWeaponTypes {
     utilQueries {
    getAllWeaponTypes {
      id
      name
    }
  }
      }
    `,
    };
    return this.solvePromise(query, v => v.data.utilQueries.getAllWeaponTypes);

  }

  createWeapon(associationID: string, weaponName: string, weaponStatusInterface: WeaponStatusInterface, weaponType: WeaponType) {
    const query = {
      query: `
         mutation createWeapon($dto: CreateWeaponDTO!, $associationID: ID!) {
          associationMutations {
    associationWeaponMutations {
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
    return this.solvePromise(query, v => v.data.associationMutations.associationWeaponMutations.createWeapon);
  }

  getAssociationMaintenances(associationID: string, focusDate: Date): Promise<any> {
    const startDate = subMonths(focusDate, 1);
    const endDate = addMonths(focusDate, 1);

    const query = {
      query: `
      query getWeaponMaintenancesBetween($a: ID!, $start: LocalDateTime!, $end: LocalDateTime!){
      associationQueries {
    associationWeaponQueries {
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
  }
}
    `,
      variables: {
        a: associationID,
        start: this.util.toLocalIsoDateTime(startDate),
        end: this.util.toLocalIsoDateTime(endDate),
      }
    };
    return this.solvePromise(query, v => v.data.associationQueries.associationWeaponQueries.getWeaponMaintenancesBetween);

  }

  getAllColorPresets() {
    const query = {
      query: `
     query getAllColorPresets {
     utilQueries {
    getAllColorPresets {
      colorName
      id
      primaryColor
      secondaryColor
    }
  }
      }
    `
    };
    return this.solvePromise(query, v => v.data.utilQueries.getAllColorPresets);
  }

  createWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation createWeaponMaintenance($dto: CreateWeaponMaintenanceDTO!) {
          associationMutations {
    associationWeaponMutations {
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

    return this.solvePromise(query, v => v.data.associationMutations.associationWeaponMutations.createWeaponMaintenance);

  }

  changeWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation changeWeaponMaintenance($dto: ChangeWeaponMaintenanceDTO!) {
          associationMutations {
    associationWeaponMutations {
      changeWeaponMaintenance(dto: $dto) {
        success
        message
        maintenance {
          id
          association {
            id
            name
          }
          weapon {
            id
            name
            type {
              name
            }
          }
          startDate
          endDate
          title
          colorPreset {
            id
            colorName
            primaryColor
            secondaryColor
          }
          description
        }
      }
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

    return this.solvePromise(query, v => v.data.associationMutations.associationWeaponMutations.changeWeaponMaintenance);
  }

  deleteWeaponMaintenance(associationID: string, currentWeaponMaintenance: WeaponMaintenance) {
    const query = {
      query: `
        mutation deleteWeaponMaintenance($dto: ID!, $associationID: ID!) {
          associationMutations {
    associationWeaponMutations {
      deleteWeaponMaintenance(maintenanceID: $dto, associationID: $associationID) {
            success,
            message,
          }
    }
  }
        }
      `,
      variables: {
        dto: currentWeaponMaintenance.id,
        associationID: associationID,
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationWeaponMutations.deleteWeaponMaintenance);
  }

  createTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation createTrackForAssociation($dto: TrackDTO!, $associationID: ID!) {
          associationMutations {
    associationTrackMutations {
      createTrackForAssociation(dto: $dto, associationID: $associationID) {
        success
        message
        track {
          id
          name
          description
          association {
            id
          }
          allowedWeaponTypes {
            id
            name
          }
        }
      }
    }
  }
        }
      `,
      variables: {
        dto: {
          name: track.name,
          description: track.description,
          allowedWeaponTypes: track.allowedWeaponTypes.map(e => {
            return e.id
          })
        },
        associationID: associationID,
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationTrackMutations.createTrackForAssociation);
  }

  editTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation editTrackForAssociation($dto: TrackDTO!, $associationID: ID!, $trackID: ID!) {
          associationMutations {
    associationTrackMutations {
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
  }
        }
      `,
      variables: {
        dto: {
          name: track.name,
          description: track.description,
          allowedWeaponTypes: track.allowedWeaponTypes.map(e => {
            return e.id
          })
        },
        associationID: associationID,
        trackID: track.id
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationTrackMutations.editTrackForAssociation);
  }

  deleteTrack(associationID: string, track: Track) {
    const query = {
      query: `
        mutation deleteTrackForAssociation($associationID: ID!, $trackID: ID!) {
          associationMutations {
    associationTrackMutations {
      deleteTrackForAssociation(associationID: $associationID, trackID: $trackID) {
        success
        message
      }
    }
  }
        }
      `,
      variables: {
        associationID: associationID,
        trackID: track.id
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationTrackMutations.deleteTrackForAssociation);
  }

  login(email: string, password: string) {
    const query = {
      query: `
        mutation login($loginRequest: LoginDTOInput!) {
          authenticationMutations {
    login(loginRequest: $loginRequest) {
            success,
            message,
          }
  }
        }
      `,
      variables: {
        loginRequest: {
          email: email,
          password: password
        }
      }
    };

    return this.solvePromise(query, v => v.data.authenticationMutations.login);
  }

  getTracksOfAssociation(associationID: string) {
    const query = {
      query: `
        query getTracksOfAssociation($associationID: ID!) {
          associationQueries {
    associationTrackQueries {
      getTracksOfAssociation(associationID: $associationID) {
        id
        name
        description
        association {
          id
        }
        allowedWeaponTypes {
          id
          name
        }
      }
    }
  }
        }
      `,
      variables: {
        associationID: associationID,
      }
    };

    return this.solvePromise(query, v => v.data.associationQueries.associationTrackQueries.getTracksOfAssociation);
  }

  validateToken(): Promise<any> {
    const query = {
      query: `
    {
      authenticationQueries {
    validateToken {
          success,
            message,
    }
  }
    }
  `
    };
    return this.solvePromise(query, v => v.data.authenticationQueries.validateToken);

  }

  register(email: string, password: string, fullName: string, language: string) {
    const query = {
      query: `
        mutation register($registerRequest: RegisterDTOInput!) {
          authenticationMutations {
    register(registerRequest: $registerRequest) {
            success,
            message,
          }
  }
        }
      `,
      variables: {
        registerRequest: {
          email: email,
          password: password,
          fullName: fullName,
          language: language
        }
      }
    };

    return this.solvePromise(query, v => v.data.authenticationMutations.register);
  }

  getReservations(associationID: string, date: Date) {
    const startDate = subMonths(date, 1);
    const endDate = addMonths(date, 1);
    const query = {
      query: `
        query getReservationsBetween($associationID: ID!, $startDate: LocalDateTime!, $endDate: LocalDateTime!) {
          associationQueries {
    associationReservationQueries {
      getReservationsBetween(associationID: $associationID, startDate: $startDate, endDate: $endDate) {
            success,
            reservations {
              id,
              association {
                id
              },
              startDate,
              endDate,
              title,
              description,
              status,
              maxSize,
              reservationUsers {
                id {
                userId,
                reservationId
                }
              },
              tracks {
                id,
                name
              },
              allowedWeaponTypes {
                id,
                name
              },
              reservationSeries {
                id,
                title,
                description,
                maxUsers,
                reservations {
                  id
                }

              },
              colorPreset {
                  id,
                colorName,
                primaryColor,
                secondaryColor
              }
            },
          }
    }
  }
        }
      `,
      variables: {
        associationID: associationID,
        startDate: this.util.toLocalIsoDateTime(startDate),
        endDate: this.util.toLocalIsoDateTime(endDate),
      }
    };

    return this.solvePromise(query, v => v.data.associationQueries.associationReservationQueries.getReservationsBetween);
  }

  createTrackReservation(reservation: Reservation, associationID: string, series: ReservationSeries) {
    const query = {
      query: `
        mutation createReservations($dto: CreateReservationDTO!) {
          associationMutations {
    associationTrackMutations {
      createReservations(dto: $dto) {
            success,
            message,
            reservationSeries {
               id,
                  title,
                  description,
                  maxUsers,
                  reservations {
                    id
                  }
            }
            reservations {
              id,
              association {
                id
              },
              startDate,
              endDate,
              title,
              description,
              status,
              maxSize,
              reservationUsers {
                id {
                userId,
                reservationId
                }
              },
              tracks {
                id,
                name
              },
              allowedWeaponTypes {
                id,
                name
              },
              reservationSeries {
                id,
                title,
                description,
                maxUsers,
                reservations {
                  id
                }

              },
              colorPreset {
                  id,
                colorName,
                primaryColor,
                secondaryColor
              }
            },
          }
    }
  }
        }
      `,
      variables: {
        dto: {
          title: reservation.title,
          description: reservation.description,
          startTime: reservation.startDate,
          endTime: reservation.endDate,
          maxSize: reservation.maxSize,
          repeatType: series.reservationRepeat,
          repeatUntil: series.repeatUntil,
          customDaysBetween: series.repeatDaysBetween,
          associationID: associationID,
          tracks: reservation.tracks.map(r => r.id),
          allowedWeaponTypes: reservation.allowedWeaponTypes.map(a => a.id),
          colorPreset: reservation.colorPreset?.id ? reservation.colorPreset.id : ""
        }
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationTrackMutations.createReservations);
  }

  changeWeapon(associationID: string, weaponID: string, weaponName: string, weaponStatusInterface: WeaponStatusInterface, weaponType: WeaponType) {
    const query = {
      query: `
         mutation changeWeapon($dto: ChangeWeaponDTO!, $associationID: ID!) {
          associationMutations {
    associationWeaponMutations {
      changeWeapon(dto: $dto, associationID: $associationID) {
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
  }
        }
      `,
      variables: {
        dto: {
          weaponName: weaponName,
          weaponType: weaponType.id,
          weaponStatus: weaponStatusInterface.id,
          weaponID: weaponID
        },
        associationID: associationID
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.associationWeaponMutations.changeWeapon);
  }

  changeLanguage(language: string) {
    const query = {
      query: `
         mutation updateLanguage($language: String!) {
          userMutations {
    updateLanguage(language: $language) {
      success
      message
    }
  }
        }
      `,
      variables: {
        language: language
      }
    };
    return this.solvePromise(query, v => v.data.userMutations.updateLanguage);
  }
}
