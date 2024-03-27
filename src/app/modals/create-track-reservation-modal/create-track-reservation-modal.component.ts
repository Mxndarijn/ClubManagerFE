import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {
  Reservation,
  ReservationRepeat,
  ReservationRepeatLabels,
  ReservationSeries
} from "../../CoreModule/models/reservation.model";
import {Modal, ModalService} from "../../CoreModule/services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../CoreModule/services/alert.service";
import {DefaultModalInformation} from "../../SharedModule/models/default-modal-information";
import {WeaponType} from '../../CoreModule/models/weapon-type.model';
import {Track} from "../../CoreModule/models/track.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {ColorPreset} from "../../CoreModule/models/color-preset.model";
import {ValidationUtils} from '../../SharedModule/utilities/validation-utils';
import {
  SingleErrorMessageComponent
} from "../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {UtilityFunctions} from "../../SharedModule/utilities/utility-functions";
import {
  ErrorMessageComponent
} from "../../SharedModule/components/error-messages/error-message/error-message.component";
import {addDays} from "date-fns";
import {CreateTrackReservationDTO} from "../../CoreModule/models/dto/create-track-reservation-dto";
import {AlertClass, AlertIcon} from "../../SharedModule/components/alerts/alert-info/alert-info.component";
import {
  InputFieldWeaponModalComponent
} from "../../../SharedModule/components/input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {
  TextareaModalComponent
} from "../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {
  DateTimeSelectorComponent
} from "../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {
  DefaultCheckboxInputFieldComponent
} from "../../../SharedModule/components/input-fields/default-checkbox-input-field/default-checkbox-input-field.component";

enum Step {
  STEP_1,
  STEP_2,
  STEP_3,
  STEP_4
}

@Component({
  selector: 'app-create-track-reservation-modal',
  standalone: true,
  imports: [
    InputFieldWeaponModalComponent,
    TextareaModalComponent,
    NgClass,
    FormsModule,
    NgIf,
    DateTimeSelectorComponent,
    NgForOf,
    ReactiveFormsModule,
    KeyValuePipe,
    DefaultCheckboxInputFieldComponent,
    TranslateModule,
    NgStyle,
    SingleErrorMessageComponent,
    NgSwitch,
    NgSwitchCase,
    ErrorMessageComponent,
    AsyncPipe,
  ],
  templateUrl: './create-track-reservation-modal.component.html',
  styleUrl: './create-track-reservation-modal.component.css'
})
export class CreateTrackReservationModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private associationID: string;
  protected currentReservation?: Reservation;

  @Input() SetCurrentReservation!: EventEmitter<Reservation>;

  @Input() ReservationCreatedEvent! : EventEmitter<Reservation[]>
  @Input() ReservationEditedEvent! : EventEmitter<Reservation[]>
  @Input() ReservationDeleteEvent!: EventEmitter<Reservation[]>

  protected step1ReservationForm: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    weaponTypes: FormControl<WeaponType[] | null>;
    maxSize: FormControl<number>;
    color: FormControl<ColorPreset | null>;
  }>;
  protected step2ReservationForm: FormGroup<{
    tracks: FormControl<Track[] | null>;
  }>

  protected step3ReservationForm: FormGroup<{
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    repeats: FormControl<boolean | undefined>;
  }>

  protected createSeriesForm: FormGroup<{
    repeatUntil: FormControl<string | undefined>
    repeatDaysBetween: FormControl<number>
    repeatType: FormControl<ReservationRepeat | undefined>
  }>;

  protected weaponTypeList: WeaponType[] = [];
  protected tracksList: Track[] = [];
  protected colorPresets: ColorPreset[] = []


  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication,
    private alertService: AlertService,
    private translate: TranslateService,
    protected util: UtilityFunctions,
  ) {
    super(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION, modalService);
    this.associationID = route.snapshot.params['associationID'];

    this.graphQLService.getAllWeaponTypes(this.associationID).subscribe({
      next: (response) => {
        this.weaponTypeList = response.data.getAllWeaponTypes
      }
    })

    this.graphQLService.getTracksOfAssociation(this.associationID).subscribe({
      next: (response) => {
        this.tracksList = response.data.getTracksOfAssociation;
      }
    })

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
    this.step1ReservationForm = new FormGroup({
      title: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3)])),
      description: new FormControl("", Validators.required),

      weaponTypes: new FormControl([], Validators.required),
      maxSize: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
      color: new FormControl(null, Validators.required)
    });

    // @ts-ignore
    this.step2ReservationForm = new FormGroup({
      tracks: new FormControl([], Validators.required),

    });

    // @ts-ignore
    this.step3ReservationForm = new FormGroup({
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      repeats: new FormControl(false, Validators.required),
    }, { validators: ValidationUtils.validateDatesFactory("startDate", "endDate")});


    // @ts-ignore
    this.createSeriesForm = new FormGroup({
      repeatUntil: new FormControl("", Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      repeatType: new FormControl(undefined, Validators.required),
      repeatDaysBetween: new FormControl(0, Validators.min(1))
    }, );

    this.step3ReservationForm.controls.startDate.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.startTime = await this.util.formatDateTimeAsString(value!);
      }
    })
    this.step3ReservationForm.controls.endDate.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.endTime = await this.util.formatDateTimeAsString(value!);
      }
    })
    this.createSeriesForm.controls.repeatUntil.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.repeatTime = await this.util.formatDateTimeAsString(value!);
      }
    })
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetCurrentReservation.subscribe({
      next: (reservation: Reservation) => {
        this.title = reservation.id != null ? "Nieuwe reservering" : "Wijzig reservering"
        this.currentReservation = reservation;
        this.step1ReservationForm.patchValue({
          title: this.currentReservation?.title,
          description: this.currentReservation?.description,
          weaponTypes: this.currentReservation?.allowedWeaponTypes,
          maxSize: this.currentReservation?.maxSize,
          color: this.currentReservation?.colorPreset,
        });

        this.step2ReservationForm.patchValue({
          tracks: this.currentReservation?.tracks,
        });

        this.step3ReservationForm.patchValue({
          startDate: this.currentReservation?.startDate,
          endDate: this.currentReservation?.endDate,
          repeats: this.currentReservation.reservationSerie != null && this.currentReservation.reservationSerie.id.length > 0,
        });

        this.createSeriesForm.patchValue({
          repeatUntil: this.currentReservation?.reservationSerie?.repeatUntil,
          repeatDaysBetween: this.currentReservation?.reservationSerie?.repeatDaysBetween,
          repeatType: this.currentReservation.reservationSerie?.reservationRepeat
        });
      }
    }))
  }

  setCurrentValues(setSerie: boolean) {
    if (this.currentReservation == null)
      return;
    this.currentReservation.tracks = this.step2ReservationForm.controls.tracks.value!;
    this.currentReservation.title = this.step1ReservationForm.controls.title.value!;
    this.currentReservation.description = this.step1ReservationForm.controls.description.value!;
    this.currentReservation.allowedWeaponTypes = this.step1ReservationForm.controls.weaponTypes.value!;
    this.currentReservation.tracks = this.step2ReservationForm.controls.tracks.value!;
    this.currentReservation.startDate = this.step3ReservationForm.controls.startDate.value!;
    this.currentReservation.endDate = this.step3ReservationForm.controls.endDate.value!;
    this.currentReservation.maxSize = this.step1ReservationForm.controls.maxSize.value!;
    this.currentReservation.colorPreset = this.step1ReservationForm.controls.color.value!
    if (!setSerie)
      return;

    if (this.currentReservation.reservationSerie) {
      this.currentReservation.reservationSerie.repeatUntil = this.createSeriesForm.controls.repeatUntil.value!;
      this.currentReservation.reservationSerie.repeatDaysBetween = this.createSeriesForm.controls.repeatDaysBetween.value!;
      this.currentReservation.reservationSerie.reservationRepeat = this.createSeriesForm.controls.repeatType.value!;
    } else {
      this.currentReservation.reservationSerie = {
        id: "", reservations: [],
        repeatUntil: this.createSeriesForm.controls.repeatUntil.value!,
        repeatDaysBetween: this.createSeriesForm.controls.repeatDaysBetween.value!,
        reservationRepeat: this.createSeriesForm.controls.repeatType.value!
      };
    }

  }

  createReservation() {
    this.setCurrentValues(true);
    const series = this.createSeries();
    this.graphQLService.createTrackReservation(this.currentReservation!, this.associationID, series).subscribe({
      next: (response) => {
        const dto = response.data.createReservations as CreateTrackReservationDTO
        if(dto.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Baan reservering is toegevoegd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
          this.ReservationCreatedEvent.emit(dto.reservations);
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
        console.log(response)
        this.hideModal()
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        console.log(e)
        this.hideModal()
      }
    });
  }

  saveReservation() {
    this.setCurrentValues(false);
  }

  protected readonly ReservationRepeat = ReservationRepeat;
  protected readonly ReservationRepeatLabels = ReservationRepeatLabels;
  protected step: Step = Step.STEP_1;
  protected readonly Step = Step;
  protected steps = [
    {
      step: Step.STEP_1,
      label: "createTrackReservationModal.steps.step1"
    },
    {
      step: Step.STEP_2,
      label: "createTrackReservationModal.steps.step2"
    },
    {
      step: Step.STEP_3,
      label: "createTrackReservationModal.steps.step3"
    },
    {
      step: Step.STEP_4,
      label: "createTrackReservationModal.steps.step4"
    }]

  increaseStep() {
    this.step++;
  }

  decreaseStep() {
    this.step--;
  }

  getClassForStep(currentStep: Step) {
    if (currentStep <= this.step) {
      return "step-accent";
    }
    return "";
  }

  isDisabled() {
    switch (this.step) {
      case Step.STEP_1:
        return !this.step1ReservationForm.valid;
      case Step.STEP_2:
        return !this.step2ReservationForm.valid;
      case Step.STEP_3:
        return !(this.step3ReservationForm.controls.repeats.value ? this.step3ReservationForm.valid && this.createSeriesForm.valid : this.step3ReservationForm.valid);
    }
    return false;
  }

  canSubmit() {
    let valid = this.step1ReservationForm.valid && this.step2ReservationForm.valid && this.step3ReservationForm.valid
    if (this.step3ReservationForm.controls.repeats) {
      valid = valid && this.createSeriesForm.valid;
    }
    return valid;
  }

  onWeaponTypeChange(weaponType: WeaponType, event: any) {
    const checked = event.target.checked;
    if(checked) {
      const list = this.step1ReservationForm.controls.weaponTypes.value!;
      list.push(weaponType)
      this.step1ReservationForm.controls.weaponTypes.setValue(list);
    } else {
      this.step1ReservationForm.controls.weaponTypes.setValue(this.step1ReservationForm.controls.weaponTypes.value!.filter(type => type !== weaponType));
    }

  }

  containsWeaponTypeInList(weaponType: WeaponType) {
    return this.step1ReservationForm.controls.weaponTypes.value!.includes(weaponType);

  }

  getSubTitleForStep() {
    switch (this.step) {
      case Step.STEP_1:
        return "Vul de correcte gegevens in";
      case Step.STEP_2:
        return "Selecteer de banen";
      case Step.STEP_3:
        return "Selecteer een datum en herhaling";
      case Step.STEP_4:
        return "Bevestig reservering";
    }
    return "Onbekend";
  }

  containsTrackInList(track: Track) {
    return this.step2ReservationForm.controls.tracks.value!.includes(track);

  }

  onTrackChange(track: Track, event: any) {
    const checked = event.target.checked;
    if(checked) {
      const list = this.step2ReservationForm.controls.tracks.value!;
      list.push(track)
      this.step2ReservationForm.controls.tracks.setValue(list);
    } else {
      this.step2ReservationForm.controls.tracks.setValue(this.step2ReservationForm.controls.tracks.value!.filter(type => type !== track));
    }
  }


  private specificDayAndTime = new Date();
  protected currentDay = new Date(this.specificDayAndTime.getFullYear(), this.specificDayAndTime.getMonth(), this.specificDayAndTime.getDate());
  protected startTime: string = "";
  protected endTime: string = "";
  protected repeatTime: string = "";

  private createSeries() : ReservationSeries {
    if(this.step3ReservationForm.controls.repeats.value) {
      return {
        id: " ",
        reservations: [],
        reservationRepeat: this.createSeriesForm.controls.repeatType.value!,
        repeatDaysBetween: this.createSeriesForm.controls.repeatDaysBetween.value!,
        repeatUntil: this.createSeriesForm.controls.repeatUntil.value!
      } as ReservationSeries
    } else {
      return {
        id: " ",
        reservations: [],
        reservationRepeat: ReservationRepeat.NO_REPEAT,
        repeatDaysBetween: 0,
        repeatUntil: this.util.toLocalIsoDateTime(addDays(new Date(),1))
      }
    }
  }

}



