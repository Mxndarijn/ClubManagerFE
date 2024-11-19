import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {Subscription} from "rxjs";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
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
  CompetitionScoreDTO,
  CompetitionScoreType, SmallCompetitionScore
} from '../../../../CoreModule/models/association-competition';
import {User} from "../../../../CoreModule/models/user.model";
import {TranslateModule} from "@ngx-translate/core";
import {
  InputFieldDurationComponent
} from "../../../../SharedModule/components/input-fields/input-field-duration/input-field-duration.component";

@Component({
  selector: 'app-competition-create-user-scores',
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
    TranslateModule,
    InputFieldDurationComponent
  ],
  templateUrl: './competition-create-user-scores.html',
  styleUrl: './competition-create-user-scores.css'
})
export class CompetitionCreateUserScores extends DefaultModalInformation implements OnInit, OnDestroy {
  private associationID: string;
  private competitionID: string;
  private subscriptions: Subscription[] = [];
  protected scores : SmallCompetitionScore[] = []
  private currentUser : User | undefined;
  protected currentType: CompetitionScoreType | undefined;
  @Output() UserScoresAddedEvent = new EventEmitter<null>;
  @Input() SetCurrentUser : EventEmitter<User> | undefined;
  @Input() SetCurrentType: EventEmitter<CompetitionScoreType> | undefined;

  protected addScoreFormGroup: FormGroup<{
    date: FormControl<string | null>;
    score: FormControl<number | null>;
  }>;


  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService,
    protected utility: UtilityFunctions,
    route: ActivatedRoute,
  ) {
    super(Modal.ASSOCIATION_COMPETITION_MEMBERS_ADD_USER_SCORE, modalService);
    this.associationID = route.snapshot.params['associationID'];
    this.competitionID = route.snapshot.params['competitionID'];
    this.OnModalShowEvent.subscribe({
      next: () => {
      }
    })

    // @ts-ignore
    this.addScoreFormGroup = new FormGroup({
      date: new FormControl("", Validators.required),
      score: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    if(this.SetCurrentUser != null) {
      this.subscriptions.push(
        this.SetCurrentUser.subscribe({next: (user : User) => {
           this.currentUser = user;
          }})
      )
    }
    if(this.SetCurrentType != null) {
      this.subscriptions.push(
        this.SetCurrentType.subscribe({next: (type: CompetitionScoreType) => {
            this.currentType = type;
          }})
      )
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }




  protected readonly Modal = Modal;

  addScore(): void {
    if(this.addScoreFormGroup.valid) {
      this.scores.push(
        {
          score: this.addScoreFormGroup.controls.score.value!,
          scoreDate: this.addScoreFormGroup.controls.date.value!,
        }
      )
      this.addScoreFormGroup.reset()
      this.OnFormReset.emit()

    }
  }

  removeScore(score: SmallCompetitionScore) {
    this.scores = this.scores.filter(s => { return s!= score})
  }

  sendScores() {
    if(this.scores.length > 0) {
      if(this.currentUser?.id == null) {
        console.log("ID is null")
        console.log(this.currentUser)
      }
      this.graphQLService.createCompetitionUserScores(this.associationID, this.competitionID, this.currentUser!.id, this.scores).then((response) => {
        if(response.success) {
          this.hideModal()
          this.UserScoresAddedEvent.emit()
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De scores zijn toegevoegd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het toevoegen van de scores.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      })

    }

  }

  protected readonly CompetitionScoreType = CompetitionScoreType;
  OnFormReset: EventEmitter<null> = new EventEmitter;
}
