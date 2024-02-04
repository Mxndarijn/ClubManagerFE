import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {DefaultInputFieldComponent} from "../../input-fields/default-input-field/default-input-field.component";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {Weapon, WeaponStatus} from "../../../model/weapon.model";
import {WeaponType} from "../../../model/weapon-type.model";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../services/modal.service";
import {CreateWeaponResponseDTO} from "../../../model/dto/create-weapon-response-dto";
import {AlertService} from "../../services/alert.service";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";
export interface WeaponStatusInterface {
  status: string,
  id: string,
}

@Component({
  selector: 'app-create-weapon-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    SingleErrorMessageComponent,
    NgClass,
    DefaultInputFieldComponent
  ],
  templateUrl: './create-weapon-modal.component.html',
  styleUrl: './create-weapon-modal.component.css'
})

export class CreateWeaponModalComponent implements OnInit {
  showModal: boolean = false;
  createWeaponForm: FormGroup<{
    name: FormControl<string | null>;
    status: FormControl<WeaponStatusInterface | null>;
    type: FormControl<WeaponType | null>;
  }>;
  @Input() associationID: string = '';
  weaponTypeList: WeaponType[] = [];
  weaponStatuses: WeaponStatusInterface[] = [
    {
    status: WeaponStatus.ACTIVE,
      id: "ACTIVE"
  },
    {
      status: WeaponStatus.INACTIVE,
      id: "INACTIVE"
    }]
  @Output() CreateWeaponEvent = new EventEmitter<Weapon>();

  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService
  ) {
    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if (modalChange.modal == Modal.ASSOCIATION_WEAPONS_CREATE_WEAPON)
          this.showModal = (modalChange.status === ModalStatus.OPEN);
      }
    })
    // @ts-ignore
    this.createWeaponForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      status: new FormControl(this.weaponStatuses[0], Validators.required),
      type: new FormControl(null, Validators.required),
    });


  }
  ngOnInit(): void {
    this.graphQLService.getAllWeaponTypes(this.associationID).subscribe({
      next: (response) => {
        this.weaponTypeList = response.data.getAllWeaponTypes
      }
    })
    }


  protected readonly WeaponStatus = WeaponStatus;

  createWeapon() {
    if (this.createWeaponForm.valid) {
      this.graphQLService.createWeapon(
        this.associationID,

        this.createWeaponForm.controls.name.value!,
        this.createWeaponForm.controls.status.value!,
        this.createWeaponForm.controls.type.value!
      ).subscribe({
        next: (response) => {
          const weaponDTO: CreateWeaponResponseDTO = response.data.createWeapon
          if(weaponDTO.success) {
            this.createWeaponForm.controls.type.reset();
            this.createWeaponForm.controls.name.reset();
            this.CreateWeaponEvent.emit(weaponDTO.weapon);
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "Het wapen is succesvol aangemaakt.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
          } else {
            this.createWeaponForm.controls.type.reset();
            this.createWeaponForm.controls.name.reset();
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Er is een fout opgetreden.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }

        },
        error: (e) => {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      });
      this.modalService.hideModal(Modal.ASSOCIATION_WEAPONS_CREATE_WEAPON);
    }

  }

  protected readonly Modal = Modal;

  closeModal() {
    this.modalService.hideModal(Modal.ASSOCIATION_WEAPONS_CREATE_WEAPON)
    this.createWeaponForm.controls.type.reset();
    this.createWeaponForm.controls.name.reset();
  }
}
