import {Routes} from '@angular/router';
import {AuthGuard} from './CoreModule/guards/auth.guard.spec';
import {LoginPageComponent} from './features/AuthModule/pages/login-page/login-page.component';
import {RegisterPageComponent} from "./features/AuthModule/pages/register-page/register-page.component";
import {HomePageComponent} from "./features/UserModule/pages/home-page/home-page.component";
import {ReservationPageComponent} from "./features/UserModule/pages/reservation-page/reservation-page.component";
import {AssociationManagerGuard} from "./CoreModule/guards/association-manager-guard.spec";
import {InvitationsPageComponent} from "./features/UserModule/pages/invitations-page/invitations-page.component";
import {UpdateProfilePageComponent} from "./features/UserModule/pages/update-profile-page/update-profile-page.component";
import {CompetitionPageComponent} from "./features/AssociationModule/pages/competition-page/competition.component";
import {
  AssociationMembersPageComponent
} from "./features/AssociationModule/pages/association-members-page/association-members-page.component";
import {SettingsPageComponent} from "./features/AssociationModule/pages/settings-page/settings-page.component";
import {WeaponPageComponent} from "./features/AssociationModule/pages/weapon-page/weapon-page.component";
import {
  TrackConfigurationPageComponent
} from "./features/AssociationModule/pages/track-configuration-page/track-configuration-page.component";

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
    canActivate: [AuthGuard, AssociationManagerGuard],
  },

];
