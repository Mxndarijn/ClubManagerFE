import {Component} from '@angular/core';
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {ActivatedRoute} from "@angular/router";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {AssociationCompetition} from "../../../../CoreModule/models/association-competition";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";

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
    UpdateUserModalComponent
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
    navigationService: NavigationService,
    route: ActivatedRoute,
  ) {
    this.associationID = route.snapshot.params['associationID'];
    this.graphQLCommunication.getAssociationName(this.associationID).then(r=>{
      navigationService.setSubTitle(r.name);
      this.associationName = r.name;
    })
    this.translate.get('associationCompetition.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLCommunication.getAssociationCompetitions(this.associationID).then(r=>{
      this.allCompetitions = r.competitions
      console.log(r)
      this.searchCompetition(this.latestSearchParam);
    })



  }
  searchCompetition(searchString: string) {
    this.latestSearchParam = searchString;
    this.filteredCompetitions = this.allCompetitions.filter(competition => {
      return competition.name.includes(searchString) || competition.name.includes(searchString);
    });

  }

  viewCompetition(competition: AssociationCompetition) {

  }
}
