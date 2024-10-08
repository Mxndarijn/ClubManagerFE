import {Component, EventEmitter} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {TranslateService} from "@ngx-translate/core";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {AssociationCompetition} from "../../../../CoreModule/models/association-competition";
import {NgForOf} from "@angular/common";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  CompetitionMemberOverviewModalComponent
} from "../../modals/competition-member-overview-modal/competition-member-overview-modal.component";

@Component({
  selector: 'app-view-competiton-page',
  standalone: true,
  imports: [
    NgForOf,
    CompetitionMemberOverviewModalComponent
  ],
  templateUrl: './view-competiton-page.component.html',
  styleUrl: './view-competiton-page.component.css'
})
export class ViewCompetitonPageComponent {
  private associationID: string;
  private competitionID: string;
  protected competition?: AssociationCompetition;
  private associationUsers: UserAssociation[] = [];
  NewUsersEvent: EventEmitter<UserAssociation[]> = new EventEmitter;

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

    this.graphQLCommunication.getAssociationName(this.associationID).then(r=>{
      navigationService.setSubTitle(r.name);
    });
    this.translate.get('associationViewCompetitionPage.titleHeader').subscribe((res: string) => {
      navigationService.setTitle(res);
    });

    this.graphQLCommunication.getAllAssociationMembers(this.associationID).then(res=>{
      if(res != null && res.users != null) {
        this.associationUsers = res.users;
      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het ophalen van de members.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })

    console.log(route.snapshot.params);
    console.log(this.competitionID);
    this.graphQLCommunication.getCompetitionDetails(this.associationID, this.competitionID).then(res=>{
      if(res.success){
        this.competition = res.competition;
        console.log(this.competition);
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


  addMemberToCompetition() {
    console.log('working')
    this.NewUsersEvent.emit(this.associationUsers);
    this.modalService.showModal(Modal.ASSOCIATION_COMPETITION_MEMBERS_OVERVIEW)
  }
}
