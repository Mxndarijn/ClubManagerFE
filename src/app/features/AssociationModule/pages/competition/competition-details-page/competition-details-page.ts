import {Component, EventEmitter} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NavigationService} from "../../../../../CoreModule/services/navigation.service";
import {UtilityFunctions} from "../../../../../SharedModule/utilities/utility-functions";
import {GraphQLCommunication} from "../../../../../CoreModule/services/graphql-communication.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Modal, ModalService} from "../../../../../CoreModule/services/modal.service";
import {AlertClass, AlertIcon} from "../../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../../CoreModule/services/alert.service";
import {
  AssociationCompetition,
  CompetitionScoreType,
  CompetitionUser
} from "../../../../../CoreModule/models/association-competition";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UserAssociation} from "../../../../../CoreModule/models/user-association.model";
import {
  SelectMultipleUsersModal
} from "../../../../../SharedModule/modals/select-multiple-users-modal/select-multiple-users-modal";
import {
  ConfirmationModalComponent
} from "../../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchBoxComponent} from "../../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {UpdateUserModalComponent} from "../../../modals/update-user-modal/update-user-modal.component";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {ReactiveFormsModule} from "@angular/forms";
import {
  SelectMultipleUsersDatasource
} from "../../../../../SharedModule/modals/select-multiple-users-modal/select-multiple-users-datasource";

@Component({
  selector: 'app-view-competition-page',
  standalone: true,
  imports: [
    NgForOf,
    SelectMultipleUsersModal,
    AsyncPipe,
    ConfirmationModalComponent,
    FaIconComponent,
    NgIf,
    SearchBoxComponent,
    TranslateModule,
    UpdateUserModalComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './competition-details-page.html',
  styleUrl: './competition-details-page.css'
})
export class CompetitionDetailsPage {
  private associationID: string;
  private readonly competitionID: string;
  protected competition?: AssociationCompetition;
  protected filteredCompetitionUsers: CompetitionUser[] = [];

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
    this.updateCompetition()
  }

  dataSource : SelectMultipleUsersDatasource = {
    hasMoreRows: true,
    searchUsers: (search: string): Promise<UserAssociation[]> => {
      return this.graphQLCommunication.getAssociationMembers(this.associationID, this.dataSource.first, this.dataSource.searchEndCursor, search)
        .then(r => {
          this.dataSource.searchHasMoreRows = r.users.pageInfo.hasNextPage;
          this.dataSource.searchEndCursor = r.users.pageInfo.endCursor;
          let users = r.users.edges.map((edge: any) => edge.node);
          if(this.competition) {
            users = users.filter((user: CompetitionUser) => {
              return !this.competition?.competitionUsers?.find(competitionUser => competitionUser.user.id === user.user.id)
            })
          }
          return users;
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    first: 20,
    loadUsers: (): Promise<UserAssociation[]> => {
      return this.graphQLCommunication.getAssociationMembers(this.associationID, this.dataSource.first, this.dataSource.endCursor)
        .then(r => {
          this.dataSource.hasMoreRows = r.users.pageInfo.hasNextPage;
          this.dataSource.endCursor = r.users.pageInfo.endCursor;
          let users = r.users.edges.map((edge: any) => edge.node);
          if(this.competition) {
            users = users.filter((user: CompetitionUser) => {
              return !this.competition?.competitionUsers?.find(competitionUser => competitionUser.user.id === user.user.id)
            })
          }
          return users;
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    onSelect: (users: UserAssociation[]): void => {
      this.graphQLCommunication.addUsersToCompetition(this.associationID, this.competitionID, users.map(u => u.user.id)).then(response => {
        if (response && response.success) {
          this.updateCompetition()
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De gekozen leden zijn succesvol toegevoegd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het toevoegen van leden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      });
    }

  }

  updateCompetition() {
    this.graphQLCommunication.getCompetitionDetails(this.associationID, this.competitionID).then(res=>{
      if(res.success){
        this.competition = res.competition;
        console.log(this.competition)
        this.searchUser("")
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


  protected readonly faTrashCan = faTrashCan;
  protected readonly CompetitionScoreType = CompetitionScoreType;

  searchUser(searchParam: string) {
    this.filteredCompetitionUsers = this.competition?.competitionUsers
      ?.filter(user => user.user.fullName.toLowerCase().includes(searchParam.toLowerCase()))
      ?.sort((a, b) => a.competitionRank - b.competitionRank) || []
  }

  getRouterLink(id: string) {
    return ['/association', this.associationID, 'competition', this.competitionID, "member", id];
  }

  protected readonly parseInt = parseInt;
  protected readonly parseFloat = parseFloat;


  protected readonly Modal = Modal;
}
