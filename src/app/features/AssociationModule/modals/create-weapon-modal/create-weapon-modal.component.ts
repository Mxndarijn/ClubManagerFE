import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {BehaviorSubject, Subscription} from "rxjs";
import {Weapon, WeaponStatus} from "../../../../CoreModule/models/weapon.model";
import {WeaponType} from "../../../../CoreModule/models/weapon-type.model";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {ActivatedRoute} from "@angular/router";
import {CreateWeaponResponseDTO} from "../../../../CoreModule/models/dto/create-weapon-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {
    InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";

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
    NgIf,
    InputFieldSingleSelectComponent,
    CustomButton
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
    status: FormControl<WeaponStatus | null>;
    type: FormControl<WeaponType | null>;
  }>;
  private associationID: string = '';
  @Output() CreateWeaponEvent = new EventEmitter<Weapon>();
  @Input() SetCurrentWeapon! : EventEmitter<Weapon>;
  @Output() ChangeWeaponEvent = new EventEmitter<Weapon>();

  singleSelectInputFieldDataSourceType: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer de type van het wapen",
    processItem(input: WeaponType): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input.name);
      });
    }
  }

  singleSelectInputFieldDataSourceStatus: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer de status van het wapen",
    processItem(input: string): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

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

    this.singleSelectInputFieldDataSourceStatus.items.next(Object.keys(WeaponStatus).filter((key) => isNaN(Number(key))))


    // @ts-ignore
    this.createWeaponForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      status: this.singleSelectInputFieldDataSourceStatus.formControl,
      type: this.singleSelectInputFieldDataSourceType.formControl,
    });
    this.graphQLService.getAllWeaponTypes().then(r=>{
        this.singleSelectInputFieldDataSourceType.items.next(r);
    })
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetCurrentWeapon.subscribe({
      next: (value: Weapon) => {
        this.currentWeapon = value;
        this.createWeaponForm.controls.name.setValue(value.name);
        if(value.status.length > 0) {
          this.createWeaponForm.controls.status.setValue(WeaponStatus[value.status as keyof typeof WeaponStatus]!);
        }
        if(value.type.id != null) {
          this.createWeaponForm.controls.type.setValue(this.singleSelectInputFieldDataSourceType.items.value.find(f => {
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
      ).then( (weaponDTO: CreateWeaponResponseDTO) =>{
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
            console.log(weaponDTO)
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Er is een fout opgetreden.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }
      }).catch(e => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
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
      ).then((weaponDTO: CreateWeaponResponseDTO) =>{
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
      }).catch(e => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
    });
      this.modalService.hideModal(Modal.ASSOCIATION_WEAPONS_CREATE_WEAPON);
    }
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
}
