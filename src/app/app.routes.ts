import {Routes} from '@angular/router';
import {AuthGuard} from './CoreModule/guards/auth-guard/auth.guard.spec';
import {LoginPageComponent} from './features/AuthModule/pages/login-page/login-page.component';
import {RegisterPageComponent} from "./features/AuthModule/pages/register-page/register-page.component";
import {HomePageComponent} from "./features/UserModule/pages/home-page/home-page.component";
import {ReservationPageComponent} from "./features/AssociationModule/pages/reservation-page/reservation-page.component";
import {AssociationManagerGuard} from "./CoreModule/guards/association-manager-guard/association-manager-guard.spec";
import {InvitationsPageComponent} from "./features/UserModule/pages/invitations-page/invitations-page.component";
import {UpdateProfilePageComponent} from "./features/UserModule/pages/update-profile-page/update-profile-page.component";
import {CompetitionPageComponent} from "./features/AssociationModule/pages/competition/competition-page/competition.component";
import {
  AssociationMembersPageComponent
} from "./features/AssociationModule/pages/association-members-page/association-members-page.component";
import {SettingsPageComponent} from "./features/AssociationModule/pages/settings-page/settings-page.component";
import {WeaponPageComponent} from "./features/AssociationModule/pages/weapon-page/weapon-page.component";
import {
  TrackConfigurationPageComponent
} from "./features/AssociationModule/pages/track-configuration-page/track-configuration-page.component";
import {
  CompetitionDetailsPage
} from "./features/AssociationModule/pages/competition/competition-details-page/competition-details-page";
import {
  CompetitionDetailMemberPageComponent
} from "./features/AssociationModule/pages/competition/competition-detail-member-page/competition-detail-member-page.component";
import {
  MyReservationsPageComponent
} from "./features/UserModule/pages/my-reservations-page/my-reservations-page.component";
import {
  EmailVerifyEmailLinkPageComponent
} from "./features/AuthModule/pages/email-verify-email-link-page/email-verify-email-link-page.component";
import {
  EmailVerificationPageComponent
} from "./features/AuthModule/pages/email-verification-page/email-verification-page.component";
import {
  viewCompetitionPageGuardGuard
} from "./CoreModule/guards/view-competition-page-guard/view-competition-page-guard.guard";
import {
  viewAssociationReservationPageGuardGuard
} from "./CoreModule/guards/view-association-reservation-page-guard/view-association-reservation-page-guard.guard";

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reservations',
    component: ReservationPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'competition',
    component: CompetitionPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: CompetitionPageComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'association/:associationID/members',
    component: AssociationMembersPageComponent,
    canActivate: [AuthGuard, AssociationManagerGuard],
  },
  {
    path: 'invitations',
    component: InvitationsPageComponent ,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UpdateProfilePageComponent ,
    canActivate: [AuthGuard],
  },
  {
    path: 'association/:associationID/settings',
    component: SettingsPageComponent,
    canActivate: [AuthGuard, AssociationManagerGuard],
  },
  {
    path: 'association/:associationID/weapons',
    component: WeaponPageComponent,
    canActivate: [AuthGuard, AssociationManagerGuard],
  },
  {
    path: 'association/:associationID/trackConfiguration',
    component: TrackConfigurationPageComponent,
    canActivate: [AuthGuard, AssociationManagerGuard],
  },
  {
    path: 'association/:associationID/book',
    component: ReservationPageComponent,
    canActivate: [AuthGuard, viewAssociationReservationPageGuardGuard],
  },
  {
    path: 'association/:associationID/competitions',
    component: CompetitionPageComponent,
    canActivate: [AuthGuard, viewCompetitionPageGuardGuard],
  },
  {
    path: 'association/:associationID/competition/:competitionID',
    component: CompetitionDetailsPage,
    canActivate: [AuthGuard, viewCompetitionPageGuardGuard],
  },
  {
    path: 'association/:associationID/competition/:competitionID/member/:competitionMemberID',
    component: CompetitionDetailMemberPageComponent,
    canActivate: [AuthGuard, viewCompetitionPageGuardGuard],
  },
  {
    path: 'myreservations',
    component: MyReservationsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify-email/:verificationCode',
    component: EmailVerifyEmailLinkPageComponent,
  },
  {
    path: 'email-verification',
    component: EmailVerificationPageComponent,
  },

];
