import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {BehaviorSubject, Subscription} from "rxjs";
import {
  DefaultInputFieldComponent, InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {CompetitionDTO,} from "../../../../CoreModule/models/competition.model";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {ErrorMessageComponent} from "../../../../SharedModule/components/error-message/error-message.component";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {ActivatedRoute} from "@angular/router";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {
  CompetitionRanking,
  CompetitionScoreType,
  CompetitionSequenceRanking
} from '../../../../CoreModule/models/association-competition';
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {
  DefaultCheckboxInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-checkbox-input-field/default-checkbox-input-field.component";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";

@Component({
  selector: 'create-competition-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    DefaultInputFieldComponent,
    TextareaModalComponent,
    DateTimeSelectorComponent,
    ErrorMessageComponent,
    NgIf,
    NgForOf,
    InputFieldSingleSelectComponent,
    DefaultCheckboxInputFieldComponent,
    CustomButton
  ],
  templateUrl: './create-competition-modal.component.html',
  styleUrl: './create-competition-modal.component.css'
})
export class CreateCompetitionModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  private associationID: string;
  private subscriptions: Subscription[] = [];
  @Output() CompetitionCreatedEvent = new EventEmitter<CompetitionDTO>;

  singleSelectInputFieldDataSource: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer de competitie ranking.",
    processItem(input: any): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

  singleSelectInputFieldDataSourceSequenceRanking: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer de competitie reeks.",
    processItem(input: any): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

  singleSelectInputFieldDataSourceType: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Je moet een waarde selecteren.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Selecteer de competitie score.",
    processItem(input: any): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

  protected createCompetitionForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    compScoreType: FormControl<CompetitionScoreType | null>;
    compRankingType: FormControl<CompetitionRanking | null>;
    competitionSequence: FormControl<boolean | null>;
  }>;


  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService,
    protected util: UtilityFunctions,
    route: ActivatedRoute,
  ) {
    super(Modal.ASSOCIATION_CREATE_COMPETITION, modalService);

    this.singleSelectInputFieldDataSourceSequenceRanking.items.next(Object.values(CompetitionSequenceRanking))
    this.singleSelectInputFieldDataSource.items.next(Object.values(CompetitionRanking))
    this.singleSelectInputFieldDataSourceType.items.next(Object.values(CompetitionScoreType))
    this.associationID = route.snapshot.params['associationID'];
    this.OnModalShowEvent.subscribe({
      next: () => {
      }
    })

    // @ts-ignore
    this.createCompetitionForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.compose([Validators.required, ValidationUtils.isDatePresentOrFuture])),
      compScoreType: this.singleSelectInputFieldDataSourceType.formControl,
      compRankingType: this.singleSelectInputFieldDataSource.formControl,
      competitionSequence: new FormControl(false, Validators.required),
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }





  protected readonly Modal = Modal;

  timeIsAfterCurrentDate(startDate: string | undefined) {
    if(!startDate) {
      return false;
    }
    const startDateTime = new Date(startDate);
    return startDateTime.getTime() > new Date().getTime();

  }

  protected readonly Object = Object;
  protected readonly CompetitionScoreType = CompetitionScoreType;
  protected readonly CompetitionRanking = CompetitionRanking;

  protected isFormValid() {
    if(this.createCompetitionForm.valid) {
      if(this.createCompetitionForm.controls.competitionSequence.value) {
        return this.singleSelectInputFieldDataSourceSequenceRanking.formControl.valid
      }
      return true
    }

    return false
  }


  createCompetition(): void {
    if (this.isFormValid()) {
      const comp: CompetitionDTO = {
        name: this.createCompetitionForm.controls.name.value!,
        description: this.createCompetitionForm.controls.description.value!,
        startDate: this.createCompetitionForm.controls.startDate.value!,
        endDate: this.createCompetitionForm.controls.endDate.value!,
        competitionScoreType: this.createCompetitionForm.controls.compScoreType.value!,
        competitionRanking: this.createCompetitionForm.controls.compRankingType.value!,
        useSequences: this.createCompetitionForm.controls.competitionSequence.value!,
        sequenceRanking: this.createCompetitionForm.controls.competitionSequence.value! ? this.singleSelectInputFieldDataSourceSequenceRanking.formControl.value! : null
      };
      console.log(comp);
      this.graphQLService.createCompetition(comp, this.associationID).then(response => {
        console.log(response)
        if(response.success) {
          const competition : CompetitionDTO = response.competition!
          this.alertService.showPositiveAlert("De competitie is succesvol aangemaakt.")
          this.CompetitionCreatedEvent.emit(competition)
          this.hideModal()
        } else {
          this.alertService.showNegativeAlert("Er is een fout opgetreden bij het aanmaken van de competitie.")
          this.hideModal()
        }
      })
    } else {
      console.warn("Could press button while invalid create competition");
    }
  }

  protected readonly InputFieldWidth = InputFieldWidth;
  protected readonly ButtonSize = ButtonSize;
  protected readonly ButtonClass = ButtonClass;
}
