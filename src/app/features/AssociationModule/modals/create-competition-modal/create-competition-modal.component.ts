import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
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
import {CompetitionRanking, CompetitionScoreType} from "../../../../CoreModule/models/competition.model";
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
    NgForOf
  ],
  templateUrl: './create-competition-modal.component.html',
  styleUrl: './create-competition-modal.component.css'
})
export class CreateCompetitionModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  protected selectedMaintenanceEvent : WeaponMaintenance | undefined
  @Input() changeSelectedEvent?: EventEmitter<WeaponMaintenance>
  @Input() changeCurrentWeaponMaintenance?: EventEmitter<WeaponMaintenance>;
  protected startTime = "";
  protected endTime = "";
  protected currentDate = new Date()
  private subscriptions: Subscription[] = [];

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
    protected util: UtilityFunctions
  ) {
    super(Modal.ASSOCIATION_CREATE_COMPETITION, modalService);
    this.OnModalShowEvent.subscribe({
      next: () => {
        console.log(this.selectedMaintenanceEvent)
        this.title = this.selectedMaintenanceEvent?.title + " "
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
    if(this.changeSelectedEvent != null) {
      this.subscriptions.push(this.changeSelectedEvent.subscribe({
        next: (event: WeaponMaintenance) => {
          this.selectedMaintenanceEvent = event;
          this.subscriptions.push(
            this.util.formatDateTimeAsString(event.startDate).subscribe({
              next: (r) => this.startTime = r,
              error: (err) => console.error('Error formatting start date', err)
            })
          );

          this.subscriptions.push(
            this.util.formatDateTimeAsString(event.endDate).subscribe({
              next: (r) => this.endTime = r,
              error: (err) => console.error('Error formatting end date', err)
            })
          );
        }
      }));
    }

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
    return startDateTime.getTime() > this.currentDate.getTime();

  }
}
