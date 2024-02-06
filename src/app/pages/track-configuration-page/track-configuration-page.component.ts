import { Component } from '@angular/core';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {getWeaponStatus} from "../../../model/weapon.model";
import {Modal, ModalService} from "../../services/modal.service";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {CreateWeaponModalComponent} from "../../modals/create-weapon-modal/create-weapon-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CreateTrackModalComponent} from "../../modals/create-track-modal/create-track-modal.component";

@Component({
  selector: 'app-track-configuration-page',
  standalone: true,
  imports: [
    NgSwitchCase,
    NgSwitch,
    CreateWeaponModalComponent,
    FaIconComponent,
    NgForOf,
    NgIf,
    CreateTrackModalComponent
  ],
  templateUrl: './track-configuration-page.component.html',
  styleUrl: './track-configuration-page.component.css'
})
export class TrackConfigurationPageComponent {
  protected activeTab = Tab.TRACKS
  protected readonly Tab = Tab;
  protected readonly getWeaponStatus = getWeaponStatus;
  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;


  constructor(
    protected modalService: ModalService
  ) {
  }
}

enum Tab {
  TRACKS,
  CALENDAR
}

