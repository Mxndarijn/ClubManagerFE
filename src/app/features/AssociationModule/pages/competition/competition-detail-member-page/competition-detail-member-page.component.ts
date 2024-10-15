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

@Component({
  selector: 'app-competition-detail-member-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SearchBoxComponent,
    TranslateModule,
    CompetitionCreateUserScores,
    FormsModule
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
        console.log(this.competitionUser)
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
  console.log(selectedScoreIds);
    this.graphQLCommunication.removeScores(this.associationID, this.competitionID, this.competitionUserID,  selectedScoreIds).then(res=>{

      console.log(res);
      this.updateCompetition();
    })

    // console.log(selectedScores);
  console.log(this.checkboxMap);
  }
}
