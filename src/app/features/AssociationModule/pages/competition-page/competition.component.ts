import {Component, EventEmitter, OnInit} from '@angular/core';
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {AssociationCompetition} from "../../../../CoreModule/models/association-competition";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {
  CreateCompetitionModalComponent,
} from "../../modals/create-competition-modal/create-competition-modal.component";
import {CompetitionDTO} from "../../../../CoreModule/models/competition.model";


@Component({
  selector: 'app-competition-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ConfirmationModalComponent,
    FaIconComponent,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    TranslateModule,
    CreateCompetitionModalComponent,
    RouterLink
  ],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css'
})
export class CompetitionPageComponent {
  protected readonly faTrashCan = faTrashCan;
  protected readonly Modal = Modal;
  private associationID: string;
  filteredCompetitions: AssociationCompetition[] = [];
  allCompetitions : AssociationCompetition[] = [];
  private associationName: string = "";
  private latestSearchParam: string = "";

  constructor(
    protected utility: UtilityFunctions,
    private graphQLCommunication: GraphQLCommunication,
    private translate: TranslateService,
    private navigationService: NavigationService,
    protected modalService: ModalService,
    route: ActivatedRoute,
  ) {
    this.navigationService.showNavigation();
    this.associationID = route.snapshot.params['associationID'];
    this.graphQLCommunication.getAssociationName(this.associationID).then(r=>{
      navigationService.setSubTitle(r.name);
      this.associationName = r.name;
    })
    this.translate.get('associationCompetitionPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.updateCompetitions()



  }

  updateCompetitions() {
    this.graphQLCommunication.getAssociationCompetitions(this.associationID).then(r=>{
      this.allCompetitions = r.competitions
      this.searchCompetition(this.latestSearchParam);
    })
  }
  searchCompetition(searchString: string) {
    this.latestSearchParam = searchString;
    this.filteredCompetitions = this.allCompetitions.filter(competition => {
      return competition.name.includes(searchString) || competition.name.includes(searchString);
    }).sort((a, b) => {
      const currentDate = new Date();
      const aEndDate = new Date(a.endDate);
      const bEndDate = new Date(b.endDate);
      if (aEndDate < currentDate && bEndDate >= currentDate) {
        return 1;
      } else if (aEndDate >= currentDate && bEndDate < currentDate) {
        return -1;
      }
      return aEndDate.getTime() - bEndDate.getTime();
    });
  }



  protected getRouterLink(competitionID : any) {
    return ['/association', this.associationID, 'competition', competitionID];
  }

  protected readonly Date = Date;

  CompetitionCreatedEvent($event: CompetitionDTO) {
    this.updateCompetitions()
  }
}
