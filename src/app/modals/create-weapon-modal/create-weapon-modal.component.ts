import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  SingleErrorMessageComponent
} from "../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {Weapon, WeaponStatus} from "../../CoreModule/models/weapon.model";
import {WeaponType} from "../../CoreModule/models/weapon-type.model";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../CoreModule/services/modal.service";
import {CreateWeaponResponseDTO} from "../../CoreModule/models/dto/create-weapon-response-dto";
import {AlertService} from "../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {
  DefaultInputFieldComponent
} from "../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";

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
    DefaultInputFieldComponent,
    NgIf
  ],
  templateUrl: './create-weapon-modal.component.html',
  styleUrl: './create-weapon-modal.component.css'
})

export class CreateWeaponModalComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []
  protected currentWeapon?: Weapon = undefined;

  showModal: boolean = false;
  createWeaponForm: FormGroup<{
    name: FormControl<string | null>;
    status: FormControl<WeaponStatusInterface | null>;
    type: FormControl<WeaponType | null>;
  }>;
  private associationID: string = '';
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
  @Input() SetCurrentWeapon! : EventEmitter<Weapon>;
  @Output() ChangeWeaponEvent = new EventEmitter<Weapon>();

  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.associationID = route.snapshot.params['associationID'];

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
    this.graphQLService.getAllWeaponTypes(this.associationID).subscribe({
      next: (response) => {
        this.weaponTypeList = response.data.getAllWeaponTypes
      }
    })
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetCurrentWeapon.subscribe({
      next: (value: Weapon) => {
        this.currentWeapon = value;
        this.createWeaponForm.controls.name.setValue(value.name);
        if(value.status.length > 0) {
          this.createWeaponForm.controls.status.setValue(this.weaponStatuses.find(f => {
            return f.id === value.status;
          })!);
        }
        if(value.type.id != null) {
          this.createWeaponForm.controls.type.setValue(this.weaponTypeList.find(f => {
            return f.id === value.type.id;
          })!);
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
            this.CreateWeaponEvent.emit(weaponDTO.weapon);
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "Het wapen is succesvol aangemaakt.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
          } else {
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

  changeWeapon() {
    if (this.createWeaponForm.valid) {
      this.graphQLService.changeWeapon(
        this.associationID,
        this.currentWeapon!.id,
        this.createWeaponForm.controls.name.value!,
        this.createWeaponForm.controls.status.value!,
        this.createWeaponForm.controls.type.value!
      ).subscribe({
        next: (response) => {
          console.log(response)
          const weaponDTO: CreateWeaponResponseDTO = response.data.changeWeapon
          if(weaponDTO.success) {
            this.ChangeWeaponEvent.emit(weaponDTO.weapon);
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "Het wapen is succesvol gewijzigd.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
          } else {
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
}
