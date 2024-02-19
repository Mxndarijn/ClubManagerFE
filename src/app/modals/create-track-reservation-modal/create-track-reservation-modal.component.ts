import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Reservation, ReservationRepeat, ReservationRepeatLabels} from "../../../model/reservation.model";
import {Modal, ModalService} from "../../services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {AlertService} from "../../services/alert.service";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {WeaponType} from '../../../model/weapon-type.model';
import {Track} from "../../../model/track.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DAYS_OF_WEEK} from "angular-calendar";
import {
  InputFieldWeaponModalComponent
} from "../../input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {TextareaModalComponent} from "../../input-fields/textarea-modal/textarea-modal.component";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {DateTimeSelectorComponent} from "../../input-fields/date-time-selector/date-time-selector.component";
import {
  DefaultCheckboxInputFieldComponent
} from "../../input-fields/default-checkbox-input-field/default-checkbox-input-field.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultSubscriptionDestroy} from "../../helpers/default-subscription-destroy";
import {Subscription} from "rxjs";
import {ColorPreset} from "../../../model/color-preset.model";
import {ValidationUtils} from '../../helpers/validation-utils';
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {daysInWeek} from "date-fns/constants";
import {Day} from "../../helpers/utility-functions";

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
    NgSwitchCase
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

  @Output() ReservationCreatedEvent = new EventEmitter<Reservation[]>
  @Output() ReservationEditedEvent = new EventEmitter<Reservation[]>
  @Output() ReservationDeleteEvent = new EventEmitter<Reservation[]>

  protected createReservationForm: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    weaponTypes: FormControl<WeaponType[] | null>;
    tracks: FormControl<Track[] | null>;
    startDate: FormControl<string | null>
    endDate: FormControl<string | null>
    maxSize: FormControl<number>
    repeats: FormControl<boolean | undefined>
    color: FormControl<ColorPreset | null>;
  }>;

  protected createSerieForm: FormGroup<{
    repeatUntil: FormControl<string | undefined>
    repeatDaysBetween: FormControl<number>
    repeatType: FormControl<ReservationRepeat | undefined>
  }>;

  private weaponTypeList: WeaponType[] = [];
  private tracksList: Track[] = [];
  protected colorPresets: ColorPreset[] = []


  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication,
    private alertService: AlertService,
    private translate: TranslateService
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
    this.createReservationForm = new FormGroup({
      title: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3)])),
      description: new FormControl("", Validators.required),
      weaponTypes: new FormControl([], Validators.required),
      tracks: new FormControl([], Validators.required),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      maxSize: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
      repeats: new FormControl(false),
      color: new FormControl(null, Validators.required)
    }, {validators: ValidationUtils.validateDatesFactory("startDate", "endDate")});

    // @ts-ignore
    this.createSerieForm = new FormGroup({
      repeatUntil: new FormControl(""),
      repeatType: new FormControl(undefined),
      repeatDaysBetween: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetCurrentReservation.subscribe({
      next: (reservation: Reservation) => {
        this.title = reservation.id != null ? "Nieuwe reservering" : "Wijzig reservering"
        this.currentReservation = reservation;
        this.createReservationForm.patchValue({
          title: this.currentReservation?.title,
          description: this.currentReservation?.description,
          weaponTypes: this.currentReservation?.allowedWeaponTypes,
          tracks: this.currentReservation?.tracks,
          startDate: this.currentReservation?.startDate,
          endDate: this.currentReservation?.endDate,
          maxSize: this.currentReservation?.maxSize,
          repeats: this.currentReservation.reservationSerie != null && this.currentReservation.reservationSerie.id.length > 0,
        });

        this.createSerieForm.patchValue({
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
    this.currentReservation.tracks = this.createReservationForm.controls.tracks.value!;
    this.currentReservation.title = this.createReservationForm.controls.title.value!;
    this.currentReservation.description = this.createReservationForm.controls.description.value!;
    this.currentReservation.allowedWeaponTypes = this.createReservationForm.controls.weaponTypes.value!;
    this.currentReservation.tracks = this.createReservationForm.controls.tracks.value!;
    this.currentReservation.startDate = this.createReservationForm.controls.startDate.value!;
    this.currentReservation.endDate = this.createReservationForm.controls.endDate.value!;
    this.currentReservation.maxSize = this.createReservationForm.controls.maxSize.value!;
    if (!setSerie)
      return;

    if (this.currentReservation.reservationSerie) {
      this.currentReservation.reservationSerie.repeatUntil = this.createSerieForm.controls.repeatUntil.value!;
      this.currentReservation.reservationSerie.repeatDaysBetween = this.createSerieForm.controls.repeatDaysBetween.value!;
      this.currentReservation.reservationSerie.reservationRepeat = this.createSerieForm.controls.repeatType.value!;
    } else {
      this.currentReservation.reservationSerie = {
        id: "", reservations: [],
        repeatUntil: this.createSerieForm.controls.repeatUntil.value!,
        repeatDaysBetween: this.createSerieForm.controls.repeatDaysBetween.value!,
        reservationRepeat: this.createSerieForm.controls.repeatType.value!
      };
    }

  }

  createReservation() {
    this.setCurrentValues(true);
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

}



