import {Routes} from '@angular/router';
import {AuthGuard} from './helpers/guards/auth.guard.spec';
import {HttpClientModule} from '@angular/common/http';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from "./pages/register-page/register-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {ReservationPageComponent} from "./pages/reservation-page/reservation-page.component";
import {VisitsPageComponent} from "./pages/visits-page/visits-page.component";
import {CompetitionPageComponent} from "./pages/competition-page/competition-page.component";
import {AssociationManagerGuard} from "./helpers/guards/association-manager-guard.spec";
import {AssociationMembersPageComponent} from "./pages/association-members-page/association-members-page.component";
import {InvitationsPageComponent} from "./pages/invitations-page/invitations-page.component";
import {UpdateProfilePageComponent} from "./pages/update-profile-page/update-profile-page.component";
import {SettingsPageComponent} from "./pages/settings-page/settings-page.component";
import {WeaponPageComponent} from "./pages/weapon-page/weapon-page.component";
import {TrackConfigurationPageComponent} from "./pages/track-configuration-page/track-configuration-page.component";

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
    path: 'visits',
    component: VisitsPageComponent,
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

];
