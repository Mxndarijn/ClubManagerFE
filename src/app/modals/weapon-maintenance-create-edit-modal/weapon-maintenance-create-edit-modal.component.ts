import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {Modal, ModalService} from '../../services/modal.service';
import {WeaponMaintenance} from "../../../model/weapon-maintenance.model";
import {DefaultInputFieldComponent} from "../../input-fields/default-input-field/default-input-field.component";
import {DefaultTextAreaComponent} from "../../input-fields/default-text-area/default-text-area.component";
import {Weapon} from '../../../model/weapon.model';
import {DateTimeSelectorComponent} from "../../input-fields/date-time-selector/date-time-selector.component";
import {TextareaModalComponent} from "../../input-fields/textarea-modal/textarea-modal.component";
import {GraphQLCommunication} from '../../services/graphql-communication.service';
import {ColorPreset} from "../../../model/color-preset.model";
import {ActivatedRoute} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {
  InputFieldWeaponModalComponent
} from "../../input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {UtilityFunctions} from "../../helpers/utility-functions";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import { ValidationUtils } from '../../helpers/validation-utils';
import {ErrorMessageComponent} from "../../error-messages/error-message/error-message.component";
import {CreateWeaponMaintenanceResponseDTO} from "../../../model/dto/create-weapon-maintenance-response-dto.model";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-weapon-maintenance-create-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    DefaultInputFieldComponent,
    DefaultTextAreaComponent,
    NgForOf,
    DateTimeSelectorComponent,
    TextareaModalComponent,
    ReactiveFormsModule,
    InputFieldWeaponModalComponent,
    NgIf,
    SingleErrorMessageComponent,
    ErrorMessageComponent,
    TranslateModule
  ],
  templateUrl: './weapon-maintenance-create-edit-modal.component.html',
  styleUrl: './weapon-maintenance-create-edit-modal.component.css'
})
export class WeaponMaintenanceCreateEditModalComponent extends DefaultModalInformation implements OnInit {
  protected currentWeaponMaintenance?: WeaponMaintenance
  protected weapons: Weapon[] = []
  protected colorPresets: ColorPreset[] = []
  protected associationID: string
  @Input() changeCurrentWeaponMaintenance?: EventEmitter<WeaponMaintenance>;
  protected weaponMaintenanceFormGroup: FormGroup<{
    maintenanceTitle: FormControl<string | null>;
    maintenanceColor: FormControl<ColorPreset | null>;
    maintenanceStartDate: FormControl<string | null>;
    maintenanceEndDate: FormControl<string | null>;
    maintenanceDescription: FormControl<string | null>;
    maintenanceWeapon: FormControl<Weapon | null>;
  }>;

  constructor(
    private modalService: ModalService,
    private graphQLService: GraphQLCommunication,
    private route: ActivatedRoute,
    private translate: TranslateService,
    protected util: UtilityFunctions,
    private alertService: AlertService
  ) {
    super(Modal.ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE, modalService);
    this.associationID = route.snapshot.params['associationID'];

    graphQLService.getAllColorPresets().subscribe({
      next: (response) => {
        this.colorPresets = response.data.getAllColorPresets

        this.colorPresets.forEach(preset => {
          translate.get(preset.colorName).subscribe({
            next: (translatedValue) => {
              preset.colorName = translatedValue;
            }
          })
        })
      }
    })

    // @ts-ignore
    this.weaponMaintenanceFormGroup = new FormGroup({
      maintenanceTitle: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      maintenanceColor: new FormControl(null, Validators.required),
      maintenanceStartDate: new FormControl('', Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      maintenanceEndDate: new FormControl('', Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      maintenanceDescription: new FormControl(''),
      maintenanceWeapon: new FormControl(null, Validators.required),
    }, { validators: ValidationUtils.validateDates });




    graphQLService.getAllWeapons(this.associationID).subscribe({
      next: (response) => {
        this.weapons = response.data.getAllWeapons
      }
    })

  }

  ngOnInit(): void {
    this.changeCurrentWeaponMaintenance?.subscribe({
      next: (e: WeaponMaintenance) => {
        this.currentWeaponMaintenance = e;

        this.weaponMaintenanceFormGroup.controls.maintenanceTitle.setValue(e.title!)
        this.weaponMaintenanceFormGroup.controls.maintenanceDescription.setValue(e.description!)
        this.weaponMaintenanceFormGroup.controls.maintenanceStartDate.setValue(e.startDate!)
        this.weaponMaintenanceFormGroup.controls.maintenanceEndDate.setValue(e.endDate!)

        if(this.currentWeaponMaintenance?.weapon != null) {

          if (this.currentWeaponMaintenance?.weapon) {
            const weapon = this.weapons.find(w => w.id === this.currentWeaponMaintenance!.weapon!.id);
            if (weapon) {
              this.weaponMaintenanceFormGroup.controls.maintenanceWeapon.setValue(weapon);
            }
          }

        }

        if(this.currentWeaponMaintenance?.colorPreset) {
          const c = this.colorPresets.find(w => w.primaryColor === this.currentWeaponMaintenance!.colorPreset!.primaryColor);
          if (c) {
            this.weaponMaintenanceFormGroup.controls.maintenanceColor.setValue(c);
          }
        }
      }
    })
  }


  createMaintenance() {
    console.log(this.weaponMaintenanceFormGroup)
    if(!this.weaponMaintenanceFormGroup.valid) {
      return;
    }
    this.currentWeaponMaintenance!.startDate = this.weaponMaintenanceFormGroup.controls.maintenanceStartDate.value!;
    this.currentWeaponMaintenance!.endDate = this.weaponMaintenanceFormGroup.controls.maintenanceEndDate.value!;
    this.currentWeaponMaintenance!.title = this.weaponMaintenanceFormGroup.controls.maintenanceTitle.value!;
    this.currentWeaponMaintenance!.description = this.weaponMaintenanceFormGroup.controls.maintenanceDescription.value!;
    this.currentWeaponMaintenance!.weapon = this.weaponMaintenanceFormGroup.controls.maintenanceWeapon.value!;
    this.currentWeaponMaintenance!.colorPreset = this.weaponMaintenanceFormGroup.controls.maintenanceColor.value!;


    this.graphQLService.createWeaponMaintenance(this.associationID, this.currentWeaponMaintenance!).subscribe({
      next: (response) => {
        const dto: CreateWeaponMaintenanceResponseDTO = response.data.createWeaponMaintenance
        if(dto.success) {
          this.addWeaponMaintenanceEvent.emit(dto.maintenance)
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Wapen onderhoud is toegevoegd",
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
    this.hideModal()

  }

  protected readonly ValidationUtils = ValidationUtils;
  protected readonly Validators = Validators;
  protected readonly Date = Date;
  currentDay: Date = new Date();
  @Input() addWeaponMaintenanceEvent!: EventEmitter<WeaponMaintenance>;

  saveMaintenance() {

  }
}
