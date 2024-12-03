import {Component, EventEmitter, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, Subscription} from "rxjs";

import {addDays} from "date-fns";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {
  DefaultCheckboxInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-checkbox-input-field/default-checkbox-input-field.component";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {ErrorMessageComponent} from "../../../../SharedModule/components/error-message/error-message.component";
import {ColorPreset} from "../../../../CoreModule/models/color-preset.model";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {CreateTrackReservationDTO} from "../../../../CoreModule/models/dto/create-track-reservation-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {
  Reservation,
  ReservationRepeat,
  ReservationRepeatLabels,
  ReservationSeries
} from "../../../../CoreModule/models/reservation.model";
import {WeaponType} from "../../../../CoreModule/models/weapon-type.model";
import {Track} from "../../../../CoreModule/models/track.model";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {
  DefaultInputFieldComponent, InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {
  MultiSelectInputFieldComponent
} from "../../../../SharedModule/components/input-fields/multi-select-input-field/multi-select-input-field.component";
import {
  MultiSelectInputFieldDatasource
} from "../../../../SharedModule/components/input-fields/multi-select-input-field/multi-select-input-field-datasource";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";


enum Step {
  STEP_1,
  STEP_2,
  STEP_3,

}

@Component({
  selector: 'app-create-track-reservation-modal',
  standalone: true,
  imports: [
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
    DefaultInputFieldComponent,
    InputFieldSingleSelectComponent,
    MultiSelectInputFieldComponent,
    MultiColumnList,
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

  @ViewChild('actionHeaderTemplate', { static: true }) actionHeaderTemplate!: TemplateRef<any>;
  @ViewChild('trackNameHeaderTemplate', { static: true }) trackNameHeaderTemplate!: TemplateRef<any>;
  @ViewChild('trackDescriptionHeaderTemplate', { static: true }) trackDescriptionHeaderTemplate!: TemplateRef<any>;
  @ViewChild('availableWeaponTypesHeaderTemplate', { static: true }) availableWeaponTypesHeaderTemplate!: TemplateRef<any>;

  @ViewChild('actionRowTemplate', { static: true }) actionRowTemplate!: TemplateRef<{ data: Track }>;
  @ViewChild('trackNameRowTemplate', { static: true }) trackNameRowTemplate!: TemplateRef<{ data: Track }>;
  @ViewChild('trackDescriptionRowTemplate', { static: true }) trackDescriptionRowTemplate!: TemplateRef<{ data: Track }>;
  @ViewChild('availableWeaponTypesRowTemplate', { static: true }) availableWeaponTypesRowTemplate!: TemplateRef<{ data: Track }>;

  protected step1ReservationForm: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    weaponTypes: FormControl<WeaponType[] | null>;
    maxSize: FormControl<number>;
    color: FormControl<ColorPreset | null>;
    chooseTime: FormControl<boolean | undefined>;

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

  // protected tracksList: Track[] = [];
  // protected colorPresets: ColorPreset[] = []


  singleSelectInputFieldDataSourceColor: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: " Visualisatie kleur",
    processItem(input: ColorPreset): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input.colorName);
      });
    }
  }
  singleSelectInputFieldDataSourceCalendarRepeat: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: " Visualisatie kleur",
    processItem(input: ReservationRepeat): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

  weaponTypeDataSource: MultiSelectInputFieldDatasource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer het type van het wapen",
    processItem(input: WeaponType): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input.name);
      });
    }
  };

  dataSourceTracks: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: false,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: false,
    emptyMessage: "LEEG",
    getID: (dataRow: Track) => {
      return dataRow.id;
    },
  };



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

    this.singleSelectInputFieldDataSourceCalendarRepeat.items.next(UtilityFunctions.getEnumList(ReservationRepeat))

    this.graphQLService.getAllWeaponTypes().then(r=>{
        this.weaponTypeDataSource.items.next(r);
    })

    this.graphQLService.getTracksOfAssociation(this.associationID).then(r=>{
      this.dataSourceTracks.dataRows.next(r)
      this.dataSourceTracks.isDataLoading = false
        // this.tracksList = r;
    })

    graphQLService.getAllColorPresets().then(r=>{
        this.singleSelectInputFieldDataSourceColor.items.next(r)

    })

    // @ts-ignore
    this.step1ReservationForm = new FormGroup({
      title: new FormControl("", Validators.compose([Validators.required, Validators.minLength(3)])),
      description: new FormControl("", Validators.required),

      weaponTypes: this.weaponTypeDataSource.formControl,
      maxSize: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
      color: this.singleSelectInputFieldDataSourceColor.formControl,
      chooseTime: new FormControl(true, Validators.required)

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
      repeatType: this.singleSelectInputFieldDataSourceCalendarRepeat.formControl,
      repeatDaysBetween: new FormControl(1, Validators.min(1))
    }, );

    this.step3ReservationForm.controls.startDate.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.util.formatDateTimeAsString(value!).subscribe({
          next: (formattedDate) => {
            this.startTime = formattedDate;
          },
          error: (err) => {
            console.error('Error formatting date', err);
          }
        });
      }
    })
    this.step3ReservationForm.controls.endDate.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.util.formatDateTimeAsString(value!).subscribe({
          next: (formattedDate) => {
            this.endTime = formattedDate;
          },
          error: (err) => {
            console.error('Error formatting date', err);
          }
        });
      }
    })
    this.createSeriesForm.controls.repeatUntil.valueChanges.subscribe({
      next: async (value) => {
        if(value == null) return;
        this.util.formatDateTimeAsString(value!).subscribe({
          next: (formattedDate) => {
            this.repeatTime = formattedDate;
          },
          error: (err) => {
            console.error('Error formatting date', err);
          }
        });
      }
    })
  }

  ngOnInit(): void {
    this.dataSourceTracks.columns= [
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionHeaderTemplate,
        rowCell: this.actionRowTemplate,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.id;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.trackNameHeaderTemplate,
        rowCell: this.trackNameRowTemplate,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.trackDescriptionHeaderTemplate,
        rowCell: this.trackDescriptionRowTemplate,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.description;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.availableWeaponTypesHeaderTemplate,
        rowCell: this.availableWeaponTypesRowTemplate,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.allowedWeaponTypes.map(weaponType => weaponType.name).join(', ') || '';
        }
      }]
    console.log(this.dataSourceTracks)

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
          repeats: this.currentReservation.reservationSeries != null && this.currentReservation.reservationSeries.id.length > 0,
        });

        this.createSeriesForm.patchValue({
          repeatUntil: this.currentReservation?.reservationSeries?.repeatUntil,
          repeatDaysBetween: this.currentReservation?.reservationSeries?.repeatDaysBetween,
          repeatType: this.currentReservation.reservationSeries?.reservationRepeat
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
    this.currentReservation.colorPreset = this.step1ReservationForm.controls.color.value!;
    this.currentReservation.membersCanChooseTheirOwnPosition = this.step1ReservationForm.controls.chooseTime.value!;
    if (!setSerie)
      return;

    if (this.currentReservation.reservationSeries) {
      this.currentReservation.reservationSeries.repeatUntil = this.createSeriesForm.controls.repeatUntil.value!;
      this.currentReservation.reservationSeries.repeatDaysBetween = this.createSeriesForm.controls.repeatDaysBetween.value!;
      this.currentReservation.reservationSeries.reservationRepeat = this.createSeriesForm.controls.repeatType.value!;
    } else {
      this.currentReservation.reservationSeries = {
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
    this.graphQLService.createTrackReservation(this.currentReservation!, this.associationID, series).then( (dto: CreateTrackReservationDTO) =>{
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
        this.resetReservationModal();
    }).catch(e=> {
      this.alertService.showAlert({
        title: "Fout opgetreden",
        subTitle: "Er is een fout opgetreden.",
        icon: AlertIcon.XMARK,
        duration: 4000,
        alertClass: AlertClass.INCORRECT_CLASS
      });
      this.resetReservationModal()
    });
  }
  resetReservationModal() {
    this.hideModal();
    this.currentReservation = undefined;
    this.step1ReservationForm.reset();
    this.step2ReservationForm.reset();
    this.step3ReservationForm.reset();
    this.step = Step.STEP_1;
    this.step1ReservationForm.controls.chooseTime.setValue(true);

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
   ]

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
    if (this.step3ReservationForm.controls.repeats.value!) {
      valid = valid && this.createSeriesForm.valid;
    }
    console.log(valid)
    return valid;
  }

  // onWeaponTypeChange(weaponType: WeaponType, event: any) {
  //   const checked = event.target.checked;
  //   if(checked) {
  //     const list = this.step1ReservationForm.controls.weaponTypes.value!;
  //     list.push(weaponType)
  //     this.step1ReservationForm.controls.weaponTypes.setValue(list);
  //   } else {
  //     this.step1ReservationForm.controls.weaponTypes.setValue(this.step1ReservationForm.controls.weaponTypes.value!.filter(type => type !== weaponType));
  //   }
  //
  //   this.getTrackList(false).forEach(track => {
  //     this.step2ReservationForm.controls.tracks.setValue(this.step2ReservationForm.controls.tracks.value!.filter(type => type !== track));
  //   })
  // }
  //
  // containsWeaponTypeInList(weaponType: WeaponType) {
  //   if(this.step1ReservationForm.controls.weaponTypes.value != null) {
  //     return this.step1ReservationForm.controls.weaponTypes.value!.includes(weaponType);
  //   } else {
  //     return false
  //   }
  // }
  getSubTitleForStep() {

    switch (this.step) {
      case Step.STEP_1:
        return "Vul de correcte gegevens in";
      case Step.STEP_2:
        return "Selecteer de banen";
      case Step.STEP_3:
        return "Selecteer een datum en herhaling";
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

  // getTrackList(b: boolean) {
  //   return this.tracksList.filter(item => {
  //     return b === this.step1ReservationForm.controls.weaponTypes.value?.some(weaponType => item.allowedWeaponTypes.some(i => i.id === weaponType.id));
  //   });
  // }

  protected readonly InputFieldWidth = InputFieldWidth;
}



