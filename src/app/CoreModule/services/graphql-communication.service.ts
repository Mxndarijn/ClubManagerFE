import {environment} from '../../../environment/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {first, Observable} from 'rxjs';
import {WeaponType} from "../models/weapon-type.model";
import {addMonths, subMonths} from 'date-fns';
import {UtilityFunctions} from "../../SharedModule/utilities/utility-functions";
import {WeaponMaintenance} from "../models/weapon-maintenance.model";
import {Track} from "../models/track.model";
import {Reservation, ReservationSeries} from "../models/reservation.model";
import {
  WeaponStatusInterface
} from "../../features/AssociationModule/modals/create-weapon-modal/create-weapon-modal.component";
import {CompetitionDTO} from "../models/competition.model";
import {SmallCompetitionScore} from "../models/association-competition";
import {AuthenticationService} from "./authentication.service";
import {WeaponStatus} from "../models/weapon.model";
import {AssociationGuestStatus, AssociationGuestVerificationType} from "../models/dto/association-guest-response-dto";


@Injectable({
  providedIn: 'root',
})
export class GraphQLCommunication {
  associationMutations = 0;
  associationQueries = 0;
  userQueries = 0;
  userMutations = 0;

  associationMemberMutations = 0;
  associationReservationMutations = 0;
  associationSettingsMutations = 0;
  associationTrackMutations = 0;
  associationWeaponMutations = 0;
  associationCompetitionMutations = 0;
  associationCompetitionQueries = 0;
  associationUserPresenceMutations = 0;

  private associationNameCache = new Map<string, any>();

  constructor(private http: HttpClient,
              private util: UtilityFunctions,
              private injector: Injector) {
  }

  public sendGraphQLRequest(request: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(
      environment.apiUrl + '/graphql',
      request,
      {headers: headers, responseType: 'json'},
    );
  }

  public solvePromise(query: any, fun: (arg: any) => any, tryAgain = true) {
    return new Promise<any>((resolve, reject) => {
      this.sendGraphQLRequest(query).subscribe({
        next: (v) => {
          if (this.hasUnauthorizedError(v) && tryAgain) {
            this.tryRefreshToken(query, fun, resolve, reject);
          } else if (v.data === null || v.errors != null || fun(v) == null) {
            console.error(v);
            resolve(null);
          } else {
            resolve(fun(v));
          }
        },
        error: (e) => reject(e)
      });
    });
  }

  private hasUnauthorizedError(v: any): boolean {
    return v.errors != null && v.errors.length > 0 && v.errors[0].message === "Unauthorized";
  }

  private isRefreshingToken: Promise<void> | null = null;

  private tryRefreshToken(query: any, fun: (arg: any) => any, resolve: any, reject: any) {
    if (this.isRefreshingToken) {
      this.isRefreshingToken.then(() => {
        this.solvePromise(query, fun, false).then(resolve).catch(reject);
      }).catch(reject);
      return;
    }

    // Start een nieuwe refresh en sla de Promise op
    this.isRefreshingToken = new Promise<void>((refreshResolve, refreshReject) => {
      const auth = this.injector.get(AuthenticationService);
      auth.isLoggedIn().then(isLoggedIn => {
        if (isLoggedIn) {
          refreshResolve();
          this.solvePromise(query, fun, false).then(resolve).catch(reject);
          this.isRefreshingToken = null; // Reset de lock na voltooiing
        } else {
          resolve(null); // Gebruiker is ingelogd of geen refresh token beschikbaar
          refreshResolve();
          this.isRefreshingToken = null;
        }
      }).catch(error => {
        refreshReject(error);
        reject(error);
        this.isRefreshingToken = null;
      });
    });
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

  public getMyAssociationsWithoutImage(): Promise<any> {
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
            associationRoles {
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

  public getAssociationMembers(associationID: string, first: number = 20, after?: string, search = ""): Promise<any> {
    console.log(search)
    console.log("getting members")
    const query = {
      query: `
      query GetAssociationMembers($associationID: ID!, $first: Int, $after: ID, $search: String) {
        associationQueries {
    getAssociationDetails(associationID: $associationID) {
          users(first: $first, after: $after, search: $search) {
            edges {
              cursor
              node {
                memberSince
                user {
                  id
                  fullName
                  email
                  knsaMembershipNumber
                  image {
                    encoded
                  }
                }
                associationRoles {
                  name
                  id
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
  }
      }
    `,
      variables: {
        associationID: associationID,
        first: first,
        after: after,
        search: search
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

  getAssociationInvites(associationID: string, first: number = 20, after?: string, search: string = ""): Promise<any> {
    const query = {
      query: `
     query MyQuery($associationID: ID!, $first: Int, $after: ID, $search: String) {
  associationQueries {
    getAssociationDetails(associationID: $associationID) {
      invites(after: $after, first: $first, search: $search) {
        edges {
          cursor
          node {
            id
            email
            createdAt
            associationRoles {
              name
              id
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}
    `,
      variables: {
        associationID: associationID,
        first: first,
        after: after,
        search: search
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
        id
        association {
            name
            contactEmail
            image {
                id
                encoded
            }
        }
        createdAt,
        associationRoles {
          name
          id
        }
        }
      }
  }
    }
  `
    };
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile.invites);

  }

  enrollAtReservation(associationID: string, reservationID: string, joinBoolean: boolean, position : number) {
    const query = {
      query: `
    mutation MyMutation($associationID : ID!, $dto: CompetitionParticipateDTO!) {
      associationMutations {
        associationReservationMutations {
          participateReservation(associationID: $associationID, dto: $dto) {
            success
            reservation {
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
                },
                position
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
              },
              membersCanChooseTheirOwnPosition
            }
          }
        }
      }
    }
  `, variables: {
        associationID: associationID,
        dto: {
          reservationID: reservationID,
          position: position,
          join: joinBoolean
        }
      }
    };
    console.log(query)
    return this.solvePromise(query, v => v.data.associationMutations.associationReservationMutations.participateReservation);

  }

  deleteAssociationInvite(id: string): Promise<any> {
    const query = {
      query: `
      mutation MyMutation($inviteID :AssociationInviteInput! ) {
      associationMutations{
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
          associationInviteID: id
        }
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.removeAssociationInvite);

  }

  createAssociationInvite(associationID: string, email: string, idList: string[]): Promise<any> {
    const query = {
      query: `
      mutation sendAssociationInvite($dto: CreateAssociationInviteInput!) {
  associationMutations {
    associationMemberMutations {
      sendAssociationInvite(dto: $dto) {
    success,
    message,
    associationInvite {
    id,
        email,
        associationRoles {
            name
            id
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
          associationRoleUUID: idList
        }
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.sendAssociationInvite);

  }

  getAssociationName(associationID: string) {
    if(this.associationNameCache.has(associationID)) {
      return Promise.resolve(this.associationNameCache.get(associationID));
    }
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
    return this.solvePromise(query, v => {
      this.associationNameCache.set(associationID, v.data.associationQueries.getAssociationDetails.name);
      return v.data.associationQueries.getAssociationDetails
    });

  }


  acceptAssociationInvite(id: string): Promise<any> {
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
          associationInviteID: id
        }
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.acceptAssociationInvite);

  }

  rejectAssociationInvite(id: string): Promise<any> {
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
          associationInviteID: id
        }
      }
    };
    return this.solvePromise(query, v => v.data.associationMutations.associationMemberMutations.rejectAssociationInvite);

  }

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
    return this.solvePromise(query, v => v.data.userMutations.updateMyProfilePicture);
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
        email,
        knsaMembershipNumber
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

  createWeapon(associationID: string, weaponName: string, weaponStatusInterface: string, weaponType: WeaponType) {
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
          weaponStatus: weaponStatusInterface
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
            refreshToken
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

  register(email: string, password: string, fullName: string, language: string, knsaMembershipNumber: number) {
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
          language: language,
          knsaMembershipNumber: knsaMembershipNumber
        }
      }
    };
    console.log(query)

    return this.solvePromise(query, v => v.data.authenticationMutations.register);
  }

  getReservations(associationID: string, date: Date) {
    const startDate = subMonths(date, 1);
    const endDate = addMonths(date, 1);
    const query = {
      query: `
      query MyQuery($associationID: ID!, $startDate: LocalDateTime!, $endDate: LocalDateTime!) {
  associationQueries {
    getAssociationDetails(associationID: $associationID) {
      reservations(endDate: $endDate, startDate: $startDate) {
        id,
        startDate,
        endDate,
        title,
        description,
        colorPreset {
          id,
          colorName,
          primaryColor,
          secondaryColor
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        startDate: this.util.toLocalIsoDateTime(startDate),
        endDate: this.util.toLocalIsoDateTime(endDate),
      }
    };

    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);
  }

  createTrackReservation(reservation: Reservation, associationID: string, series: ReservationSeries) {
    const query = {
      query: `
        mutation createReservations($dto: CreateReservationDTO!) {
          associationMutations {
    associationReservationMutations {
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
                },
                position
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
              },
              membersCanChooseTheirOwnPosition
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
          colorPreset: reservation.colorPreset?.id ? reservation.colorPreset.id : "",
          userCanChooseOwnPosition : reservation.membersCanChooseTheirOwnPosition
        }
      }
    };

    return this.solvePromise(query, v => v.data.associationMutations.associationReservationMutations.createReservations);
  }

    changeWeapon(associationID: string, weaponID: string, weaponName: string, weaponStatusInterface: string, weaponType: WeaponType) {
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
          weaponStatus: weaponStatusInterface,
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

  getAssociationCompetitions(associationID: string) {
    const query = {
      query: `
        query MyQuery($id: ID!) {
  associationQueries {
    getAssociationDetails(associationID: $id) {
      competitions {
        active
        description
        endDate
        id
        name
        ranking
        scoreType
        startDate
      }
    }
  }
}
      `,
      variables: {
        id: associationID
      }
    }

    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);
  }

  createCompetition(comp: CompetitionDTO, associationID: string) {
    const query = {
      query: `
      mutation MyMutation($associationID: ID!, $dto: CompetitionDTO!) {
  associationMutations {
    associationCompetitionMutations {
      createCompetition(associationID: $associationID, dto: $dto) {
        message
        success
        competition {
        active
        description
        endDate
        id
        name
        ranking
        scoreType
        startDate
        competitionUsers {
          competitionRank
          id {
            competitionId
            userId
          }
          scores {
            competitionRank
            id
            score
            scoreDate
          }
          user {
            id
            fullName
            image {
              encoded
            }
            email
          }
          }
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        dto: comp
      }
    }

    return this.solvePromise(query, v => v.data.associationMutations.associationCompetitionMutations.createCompetition);

  }

  getCompetitionDetails(associationID: string, competitionID: string) {
    const query = {
      query: `
     query MyQuery($associationID: ID!, $competitionID: ID!) {
  associationQueries {
    associationCompetitionQueries {
      getCompetitionInformation(associationID: $associationID, competitionID: $competitionID) {
        success
        competition {
          active
          description
          endDate
          id
          name
          ranking
          scoreType
          startDate
          competitionUsers {
            calculatedScore
            competitionRank
            id {
              competitionId
              userId
            }
            scores {
              competitionRank
              id
              score
              scoreDate
            }
            user {
              fullName
              id
              image {
                encoded
                id
              }
            }
          }
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        competitionID: competitionID
      }
    }

    return this.solvePromise(query, v => v.data.associationQueries.associationCompetitionQueries.getCompetitionInformation);
  }

  getAllAssociationMembers(associationID: string) {
    const query = {
      query: `
     query MyQuery($associationID: ID!) {
  associationQueries {
    getAssociationDetails(associationID: $associationID) {
      users {
        id {
          userId
        }
        user {
          fullName
          id
          image {
            id
            encoded
          }
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
      }
    }
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);

  }

  addUserToCompetition(associationID: string, competitionID: string, userID: string) {
    const query = {
      query: `
     mutation MyMutation($associationID: ID!, $dto: CompetitionUserDTO!) {
  associationMutations {
    associationCompetitionMutations {
      addUser(associationID: $associationID, dto: $dto) {
        success
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        dto: {
          userID: userID,
          competitionID: competitionID,
        }
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationCompetitionMutations.addUser);


  }

  createCompetitionUserScores(associationID: string, competitionID: string, id: string, scores: SmallCompetitionScore[]) {
    const query = {
      query: `
     mutation MyMutation($dto : CompetitionScoresDTO!, $associationID: ID!) {
  associationMutations {
    associationCompetitionMutations {
      addUserScores(
        associationID: $associationID
        dto: $dto
      ) {
        success
        message
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        dto: {
          userID: id,
          competitionID: competitionID,
          scores: scores
        }
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationCompetitionMutations.addUserScores);

  }

  removeScores(associationID: string, competitionID: string, id: string, scoreIDs: string[]) {
    const query = {
      query: `
    mutation MyMutation($dto : CompetitionRemoveScoresDTO!, $associationID: ID!) {
  associationMutations {
    associationCompetitionMutations {
      removeUserScores(
        associationID: $associationID
        dto: $dto
      ) {
        success
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        dto: {
          userID: id,
          competitionID: competitionID,
          scores: scoreIDs
        }
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationCompetitionMutations.removeUserScores);

  }

  removeMemberFromCompetition(associationID: string, competitionID: string, id: string) {
    const query = {
      query: `
   mutation MyMutation($dto :  CompetitionUserDTO!, $associationID: ID!) {
  associationMutations {
    associationCompetitionMutations {
      removeUser(
       associationID: $associationID
        dto: $dto
        ){
        success
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        dto: {
          userID: id,
          competitionID: competitionID,
        }
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationCompetitionMutations.removeUser);
  }

  deleteReservation(id: string, associationID: string) {
    const query = {
      query: `
   mutation MyMutation($associationID : ID!, $reservationID: ID!) {
    associationMutations {
        associationReservationMutations {
            deleteReservation(associationID: $associationID, reservationID: $reservationID) {
                message
                success
            }
        }
    }
}`,
      variables: {
        associationID: associationID,
        reservationID: id
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationReservationMutations.deleteReservation);
  }

  deleteReservationSeries(id: string, associationID: string) {
    const query = {
      query: `
   mutation MyMutation($associationID : ID!, $reservationSeriesID: ID!) {
      associationMutations {
    associationReservationMutations {
      deleteReservationSeries(associationID: $associationID, seriesID: $reservationSeriesID) {
        message
        success
      }

    }
  }
}`,
      variables: {
        associationID: associationID,
        reservationSeriesID: id
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationReservationMutations.deleteReservationSeries);
  }

  getMyReservations(startDate: string, endDate : string, first: number = 20, after?: string) {
    const query = {
      query: `
   query MyQuery($endDate : LocalDateTime, $startDate : LocalDateTime, $first:Int, $after:LocalDateTime) {
  userQueries {
    getMyProfile {
      reservations(after: $after, endDate: $endDate, first: $first, startDate: $startDate) {
        edges {
          cursor
          node {
             id {
          reservationId
          userId
        }
        position
        registerDate
        reservation {
          description
          startDate
          endDate
          id
          membersCanChooseTheirOwnPosition
          title
          association {
            name
            id
          }
          tracks {
            name
            id
            description
          }
        }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`,
      variables: {
        endDate: endDate,
        startDate: startDate,
        after: after,
        first: first
      }
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);
  }

  getAssociationReservation(associationID: string, id: string, userID : string) {
    const query = {
      query: `query MyQuery($associationID : ID!, $reservationID: ID!, $userID : ID) {
  associationQueries {
    associationReservationQueries {
      getReservation(associationID: $associationID, reservationID: $reservationID) {
        success
        reservation {
          description
          endDate
          id
          maxSize
          membersCanChooseTheirOwnPosition
          startDate
          status
          title
          tracks {
            description
            name
          }
          allowedWeaponTypes {
            id
            name
          }
          openPositions
          reservationUsers(id: $userID) {
            id {
              reservationId
              userId
            }
          }
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        reservationID: id
      }
    }
    return this.solvePromise(query, v => v.data.associationQueries.associationReservationQueries.getReservation);
  }

  verifyEmail(verificationCode: string) {
    const query = {
      query: `mutation MyMutation($verificationCode: ID!) {
  authenticationMutations {
    verifyEmail(verificationCode: $verificationCode) {
      message
      success
    }
  }
}`,
      variables: {
        verificationCode: verificationCode,
      }
    }
    return this.solvePromise(query, v => v.data.authenticationMutations.verifyEmail);
  }

  isAccountVerified() {
    const query = {
      query: `query MyQuery {
  userQueries {
    getMyProfile {
      hasEmailVerified
    }
  }
}`,
      variables: {}
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);
  }

  changeEmailWhileInVerificationProcess(email: string) {
    const query = {
      query: `mutation MyMutation($email : String!) {
  userVerificationMutations {
    changeMyEmailInVerificationProcess(email: $email) {
      success
      message
    }
  }
}`,
      variables: {
        email: email,
      }
    }
    return this.solvePromise(query, v => v.data.userVerificationMutations.changeMyEmailInVerificationProcess);
  }

  getMyProfileEmail() {
    const query = {
      query: `query MyQuery {
  userQueries {
    getMyProfile {
      email
    }
  }
}`,
      variables: {
      }
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);
  }

  async refreshToken(token: string) {
    const query = {
      query: `mutation MyMutation($token : String!) {
  authenticationMutations {
    refreshToken(refreshToken: $token) {
      message
      refreshToken
      success
    }
  }
}`,
      variables: {
        token : token
      }
    }
    return this.solvePromise(query, v => v.data.authenticationMutations.refreshToken);

  }

  createUserPresence(associationID: string, userID: string, date: string) {
    console.log(associationID)
    const query = {
      query: `mutation MyMutation($associationID: ID!, $userID: ID!, $date: LocalDateTime!) {
  associationMutations {
    associationUserPresenceMutations {
      createUserPresence(dto: {userID: $userID, date: $date, associationID: $associationID}) {
        message
        success
        userPresence {
        createdDate
            date
            id
            user {
              fullName
              id
              image {
                encoded
              }
            }
            approvedBy {
              fullName
              id
            }
            }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        userID: userID,
        date: date
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationUserPresenceMutations.createUserPresence);
  }

  getUserPresences(first: number = 20, after?: string, search: string = "") {
    const query = {
      query: `query MyQuery($first: Int, $after: LocalDateTime, $search: String)  {
  userQueries {
    getMyProfile {
      presences(after: $after, first: $first, search: $search) {
        edges {
          cursor
          node {
            user {
              fullName
              id
            }
            approvedBy {
              fullName
              id
            }
            createdDate
            date
            id
            association {
              name
              image {
                encoded
                id
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`,
      variables: {
        after: after,
        first: first,
        search: search
      }
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);
  }

  getUserPresencesWithoutInformation(first: number = 20, after?: string, search: string = "") {
    const query = {
      query: `query MyQuery($first: Int, $after: LocalDateTime, $search: String)  {
  userQueries {
    getMyProfile {
      presences(after: $after, first: $first, search: $search) {
        edges {
          cursor
          node {
            date
            id
          }
        }
      }
    }
  }
}`,
      variables: {
        after: after,
        first: first,
        search: search
      }
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);
  }

  getAssociationPresences(associationID: string, first: number = 20, after?: string, search: string = "") {
    const query = {
      query: `query MyQuery($associationID: ID!, $first: Int, $after: LocalDateTime, $search: String)  {
  associationQueries {
    getAssociationDetails(associationID: $associationID) {
      presences(after: $after, first: $first, search: $search) {
        edges {
          cursor
          node {
            createdDate
            date
            id
            user {
              fullName
              id
              image {
                encoded
              }
            }
            approvedBy {
              fullName
              id
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        after: after,
        first: first,
        search: search
      }
    }
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);



  }

  deleteUserPresence(associationID: string, id: string) {
    const query = {
      query: `mutation MyMutation($dto: DeleteUserPresenceDTO!)  {
  associationMutations {
    associationUserPresenceMutations {
      deleteUserPresence(dto: $dto) {
        message
        success
      }
    }
  }
}`,
      variables: {
        dto: {
          associationID: associationID,
          userPresenceID: id


        }
      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationUserPresenceMutations.deleteUserPresence);
  }

  getMyAssociationGuests(first: number = 20, after?: string, search: string = "") {
    const query = {
      query: `query MyQuery($first: Int, $after: LocalDateTime, $search: String) {
  userQueries {
    getMyProfile {
      associationGuests(after: $after, first: $first, search: $search) {
        edges {
          node {
            status
            reviewer {
              fullName
            }
            requestTime
            id
            guestVerificationType
            guestVerificationCode
            guestResidence
            guestFullName
            eventTime
            association {
              id
              name
              image {
                encoded
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`,
      variables: {
        first: first,
        after: after,
        search: search
      }
    }
    return this.solvePromise(query, v => v.data.userQueries.getMyProfile);



  }
  getAssociationGuests(associationID: string, first: number = 20, after?: string, status?: string, search: string = "") {
    const query = {
      query: `query MyQuery($associationID: ID!, $status: AssociationGuestStatus, $first: Int, $after: LocalDateTime, $search: String) {
  associationQueries {
    getAssociationDetails(associationID: $associationID) {
      associationGuests(status: $status, search: $search, first: $first, after: $after) {
        edges {
          node {
            status
            reviewer {
              fullName
            }
            requestTime
            id
            guestVerificationType
            guestVerificationCode
            guestResidence
            guestFullName
            eventTime
            association {
              id
              name
            }
            requester {
              fullName
              id
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`,
      variables: {
        first: first,
        after: after,
        search: search,
        status: status,
        associationID: associationID
      }
    }
    return this.solvePromise(query, v => v.data.associationQueries.getAssociationDetails);



  }

  createGuestAssociation(associationID: string, guestFullName: string, guestResidence: string, guestVerificationType: AssociationGuestVerificationType, guestVerificationCode : string, eventTime: string) {
    const query = {
      query: `mutation MyMutation($dto: CreateAssociationGuestDTO!) {
  associationMutations {
    associationGuestMutations {
      createAssociationGuest(
        dto: $dto
      ) {
        message
        success
        associationGuest {
          eventTime
          guestFullName
          guestResidence
          guestVerificationCode
          guestVerificationType
          id
          requestTime
          status
          reviewer {
            email
            fullName
            hasEmailVerified
            id
          }
          association {
            name
            image {
              encoded
            }
          }
        }
      }
    }
  }
}`,
      variables: {
        dto: {
          associationID: associationID,
          guestFullName: guestFullName,
          guestResidence: guestResidence,
          guestVerificationType: guestVerificationType,
          guestVerificationCode: guestVerificationCode,
          eventTime: eventTime
        }
      }
    }

    console.log(query)

    return this.solvePromise(query, v => v.data.associationMutations.associationGuestMutations.createAssociationGuest);
  }

  deleteAssociationGuest(id: string, associationID : string) {
    const query = {
      query: `mutation MyMutation($associationID: ID!, $associationGuestID: ID!) {
  associationMutations {
    associationGuestMutations {
      cancelAssociationGuest(dto: {associationID: $associationID, associationGuestID: $associationGuestID}) {
        message
        success
      }
    }
  }
}`,
      variables: {
        associationID: associationID,
        associationGuestID: id

      }
    }
    return this.solvePromise(query, v => v.data.associationMutations.associationGuestMutations.cancelAssociationGuest);

  }

  changeAssociationGuestStatus(id: string, associationID: string, status: any) {
    const query = {
      query: `
      mutation MyMutation($associationID: ID!, $associationGuestID: ID!, $status: AssociationGuestStatus!) {
  associationMutations {
    associationGuestMutations {
      reviewAssociationGuest(
        dto: {associationID: $associationID, associationGuestID: $associationGuestID, status: $status}
      ) {
        message
        success
        associationGuest {
          eventTime
          guestFullName
          guestResidence
          guestVerificationCode
          guestVerificationType
          id
          requestTime
          status
          reviewer {
            email
            fullName
            hasEmailVerified
            id
          }
          association {
            name
            image {
              encoded
            }
          }
        }
      }
    }
  }
}`, variables: {
        associationID: associationID,
        associationGuestID: id,
        status: status
      }
    }

    return this.solvePromise(query, v => v.data.associationMutations.associationGuestMutations.reviewAssociationGuest);

  }

  forgotPassword(email: String) {
    const query = {
      query: `
      mutation MyMutation($email: String!) {
  userMutations {
    forgotPassword(email: $email) {
      message
      success
    }
  }
}`, variables: {
        email: email
      }
    }

    return this.solvePromise(query, v => v.data.userMutations.forgotPassword);

  }

  resetPassword(code: string, password: string) {
    const query = {
      query: `
      mutation MyMutation($code: Int!, $password: String!) {
  userMutations {
    resetPassword(dto: {resetCode: $code, newPassword: $password}) {
      message
      success
    }
  }
}`, variables: {
        code: code,
        password: password
      }
    }

    return this.solvePromise(query, v => v.data.userMutations.resetPassword);


  }
}
