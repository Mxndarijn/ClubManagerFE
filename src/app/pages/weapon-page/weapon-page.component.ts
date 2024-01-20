import {Component, EventEmitter} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SendInvitationModalComponent} from "../../modals/send-invitation-modal/send-invitation-modal.component";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AlertService} from "../../services/alert.service";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {NavigationService} from "../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {Modal, ModalService} from "../../services/modal.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";
import {CreateWeaponModalComponent} from "../../modals/create-weapon-modal/create-weapon-modal.component";
import {AssociationInvite} from "../../../model/association-invite";
import {getWeaponStatus, Weapon, WeaponStatus} from "../../../model/weapon.model";

enum Tab {
  WEAPON_OVERVIEW,
  CALENDER_VIEW
}

@Component({
  selector: 'app-weapon-page',
  standalone: true,
  imports: [
    TranslateModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    SendInvitationModalComponent,
    FaIconComponent,
    CreateWeaponModalComponent
  ],
  templateUrl: './weapon-page.component.html',
  styleUrl: './weapon-page.component.css'
})
export class WeaponPageComponent {
  activeTab: Tab = Tab.WEAPON_OVERVIEW;
  weaponList: Weapon[] = [];
  protected associationID: string;


  constructor(
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    route: ActivatedRoute,
    protected modalService: ModalService,
    ) {
    this.associationID = route.snapshot.params['associationID'];
    this.reloadData();
  }


  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }

  protected readonly Tab = Tab;

  protected readonly faTrashCan = faTrashCan;

  createWeaponEvent(weapon: Weapon) {
    this.weaponList.push(weapon);
  }

  protected readonly Modal = Modal;

  private reloadData() {
    this.graphQLCommunication.getAllWeapons(this.associationID).subscribe({
      next: (response) => {
        console.log(response)
        this.weaponList = response.data.getAllWeapons
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Wapens konden niet worden opgehaald.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })
  }

  protected readonly WeaponStatus = WeaponStatus;
  protected readonly getWeaponStatus = getWeaponStatus;
}
