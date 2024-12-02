import {Component, EventEmitter} from '@angular/core';
import {
  AssociationCompetition, CompetitionScore,
  CompetitionScoreType,
  CompetitionUser
} from "../../../../../CoreModule/models/association-competition";
import {ActivatedRoute} from "@angular/router";
import {UtilityFunctions} from "../../../../../SharedModule/utilities/utility-functions";
import {GraphQLCommunication} from "../../../../../CoreModule/services/graphql-communication.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../../../../CoreModule/services/navigation.service";
import {Modal, ModalService} from "../../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {NgForOf, NgIf} from "@angular/common";
import {SearchBoxComponent} from "../../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  CompetitionCreateUserScores
} from "../../../modals/competition-create-user-scores/competition-create-user-scores";
import {User} from "../../../../../CoreModule/models/user.model";
import {FormsModule} from "@angular/forms";
import {UserAssociation} from "../../../../../CoreModule/models/user-association.model";
import {PermissionService} from "../../../../../CoreModule/services/permission.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {
  ConfirmationModalComponent
} from "../../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {AlertInfo} from "../../../../../SharedModule/components/alerts/alert-manager/alert-manager.component";


@Component({
  selector: 'app-competition-detail-member-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SearchBoxComponent,
    TranslateModule,
    CompetitionCreateUserScores,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    ConfirmationModalComponent
  ],
  templateUrl: './competition-detail-member-page.component.html',
  styleUrl: './competition-detail-member-page.component.css'
})
export class CompetitionDetailMemberPageComponent {
  private associationID: string;
  private readonly competitionID: string;
  private readonly competitionUserID: string;
  protected competition?: AssociationCompetition;
  protected competitionUser? : CompetitionUser;
  protected checkboxMap: Map<CompetitionScore, boolean> = new Map;


  constructor(
    route: ActivatedRoute,
    protected utility: UtilityFunctions,
    private graphQLCommunication: GraphQLCommunication,
    private translate: TranslateService,
    private navigationService: NavigationService,
    protected modalService: ModalService,
    private alertService: AlertService,
    private permissionService: PermissionService,
    private router: Router


) {
    this.navigationService.showNavigation();
    this.associationID = route.snapshot.params['associationID'];
    this.competitionID = route.snapshot.params['competitionID'];
    this.competitionUserID = route.snapshot.params['competitionMemberID'];

    this.graphQLCommunication.getAssociationName(this.associationID).then(r=>{
      navigationService.setSubTitle(r.name);
    });
    this.translate.get('associationViewCompetitionPage.titleHeader').subscribe((res: string) => {
      navigationService.setTitle(res);
    });

    this.updateCompetition()
  }

  updateCompetition() {
    this.graphQLCommunication.getCompetitionDetails(this.associationID, this.competitionID).then(res=>{
      if(res.success){
        this.competition = res.competition;
        this.competitionUser = this.competition?.competitionUsers?.find(u => {
          return u.user.id == this.competitionUserID
        })
        this.competitionUser?.scores?.sort((a, b) => new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime())
      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het ophalen van de competitie.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })
  }

  protected readonly CompetitionScoreType = CompetitionScoreType;
  SetCurrentUser: EventEmitter<User> = new EventEmitter<User>;
  SetCurrentType: EventEmitter<CompetitionScoreType> = new EventEmitter<CompetitionScoreType>;


  addScores() {
    this.SetCurrentUser.emit(this.competitionUser?.user!);
    this.SetCurrentType.emit(this.competition?.scoreType)
    this.modalService.showModal(Modal.ASSOCIATION_COMPETITION_MEMBERS_ADD_USER_SCORE)
  }

  removeScores() {
    const selectedScoreIds = Array.from(this.checkboxMap.entries())
      .filter(([CompetitionScore, isSelected]) => isSelected)
      .map(([CompetitionScore, isSelected]) => CompetitionScore.id);
    this.graphQLCommunication.removeScores(this.associationID, this.competitionID, this.competitionUserID,  selectedScoreIds).then(res=>{
      this.updateCompetition();
      this.alertService.showAlert({
        title: "Succesvol",
        subTitle: "De score(s), zijn succesvol verwijderd.",
        icon: AlertIcon.CHECK,
        duration: 4000,
        alertClass: AlertClass.CORRECT_CLASS
      });
    })
  }

  removeMemberFromCompetition() {
    this.graphQLCommunication.removeMemberFromCompetition(this.associationID, this.competitionID, this.competitionUserID).then(res => {
      this.router.navigate(['/association', this.associationID, 'competition', this.competitionID]);
      if (res.success) {
        this.alertService.showAlert({
          title: "Succesvol",
          subTitle: this.competitionUser?.user?.fullName + " is succesvol verwijdered uit de competitie.",
          icon: AlertIcon.CHECK,
          duration: 4000,
          alertClass: AlertClass.CORRECT_CLASS
        })

      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: this.competitionUser?.user?.fullName + " is niet verwijdered uit de competitie.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        })
      }
    });
  }

  protected readonly Modal = Modal;
}
