import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {Modal, ModalService } from '../../services/modal.service';
import {WeaponMaintenance} from "../../../model/weapon-maintenance.model";

@Component({
  selector: 'app-weapon-create-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './weapon-create-edit-modal.component.html',
  styleUrl: './weapon-create-edit-modal.component.css'
})
export class WeaponCreateEditModalComponent extends DefaultModalInformation implements OnInit {
  protected currentWeaponMaintenance?: WeaponMaintenance
  @Input() changeCurrentWeaponMaintenance?: EventEmitter<WeaponMaintenance>;

  constructor(
    private modalService: ModalService
  ) {
    super(Modal.ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE, modalService);
  }

  ngOnInit(): void {
    this.changeCurrentWeaponMaintenance?.subscribe({
      next: (e: WeaponMaintenance) => {
        console.log("Set maintenance")
        this.currentWeaponMaintenance = e;
      }
    })
    }



}
