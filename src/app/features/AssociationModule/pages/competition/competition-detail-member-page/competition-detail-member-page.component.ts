import { Component } from '@angular/core';
import {
  AssociationCompetition,
  CompetitionScoreType,
  CompetitionUser
} from "../../../../../CoreModule/models/association-competition";
import {ActivatedRoute} from "@angular/router";
import {UtilityFunctions} from "../../../../../SharedModule/utilities/utility-functions";
import {GraphQLCommunication} from "../../../../../CoreModule/services/graphql-communication.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../../../../CoreModule/services/navigation.service";
import {ModalService} from "../../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {NgForOf, NgIf} from "@angular/common";
import {SearchBoxComponent} from "../../../../../SharedModule/components/input-fields/search-box/search-box.component";

@Component({
  selector: 'app-competition-detail-member-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SearchBoxComponent,
    TranslateModule
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
    this.competitionUserID = route.snapshot.params['competitionUserID'];

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

  addScores() {

  }
}
