import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {WeaponMaintenance} from "../../../../CoreModule/models/weapon-maintenance.model";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {Subscription} from "rxjs";
import {
  InputFieldFormComponent
} from "../../../../SharedModule/components/input-fields/input-field-form-big/input-field-form.component";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {WeaponType} from "../../../../CoreModule/models/weapon-type.model";
import {WeaponStatusInterface} from "../create-weapon-modal/create-weapon-modal.component";
import {
  CompetitionDTO,
} from "../../../../CoreModule/models/competition.model";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {ErrorMessageComponent} from "../../../../SharedModule/components/error-message/error-message.component";
import {
  InputFieldWeaponModalComponent
} from "../../../../SharedModule/components/input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {ActivatedRoute} from "@angular/router";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {CompetitionRanking, CompetitionScoreType } from '../../../../CoreModule/models/association-competition';

@Component({
  selector: 'create-competition-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    InputFieldFormComponent,
    DefaultInputFieldComponent,
    TextareaModalComponent,
    DateTimeSelectorComponent,
    ErrorMessageComponent,
    NgIf,
    InputFieldWeaponModalComponent,
    NgForOf,
    InputFieldSingleSelectComponent
  ],
  templateUrl: './create-competition-modal.component.html',
  styleUrl: './create-competition-modal.component.css'
})
export class CreateCompetitionModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  private associationID: string;
  private subscriptions: Subscription[] = [];
  @Output() CompetitionCreatedEvent = new EventEmitter<CompetitionDTO>;

  protected createCompetitionForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    compScoreType: FormControl<CompetitionScoreType | null>;
    compRankingType: FormControl<CompetitionRanking | null>;
  }>;


  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService,
    protected util: UtilityFunctions,
    route: ActivatedRoute,
  ) {
    super(Modal.ASSOCIATION_CREATE_COMPETITION, modalService);
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
      compScoreType: new FormControl(null, Validators.required),
      compRankingType: new FormControl(null, Validators.required),
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

  convertScoreTypeToText(input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(input);
    });
  }

  convertRankingToText(input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(input);
    });
  }

  createCompetition(): void {
    if (this.createCompetitionForm.valid) {
      const name = this.createCompetitionForm.controls.name.value;
      const description = this.createCompetitionForm.controls.description.value;
      const startDate = this.createCompetitionForm.controls.startDate.value;
      const endDate = this.createCompetitionForm.controls.endDate.value;
      const compScoreType = this.createCompetitionForm.controls.compScoreType.value;
      const compRankingType = this.createCompetitionForm.controls.compRankingType.value;

      if (
        name && name.length <= 255 &&
        description && description.length <= 255 &&
        startDate && endDate &&
        compScoreType && compRankingType
      ) {
        const comp: CompetitionDTO = {
          name,
          description,
          startDate,
          endDate,
          competitionScoreType: compScoreType,
          competitionRanking: compRankingType
        };
        this.graphQLService.createCompetition(comp, this.associationID).then(response => {
          if(response.success) {
            const competition : CompetitionDTO = response.competition!
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "De competitie is succesvol aangemaakt.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
            this.CompetitionCreatedEvent.emit(competition)
            this.hideModal()
          } else {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Er is een fout opgetreden bij het aanmaken van de competitie.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
            this.hideModal()
          }
        })

        // Use the comp object for further processing here

      } else {
        console.warn('Form fields do not meet the required conditions.');
      }
    } else {
      console.warn("Could press button while invalid create competition");
    }
  }
}
