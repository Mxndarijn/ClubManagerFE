import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, map, Observable} from "rxjs";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {SendInvitationModalComponent} from "../../modals/send-invitation-modal/send-invitation-modal.component";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {AssociationInvite, AssociationInviteID} from "../../../../CoreModule/models/association-invite";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertInfo} from "../../../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {
  InputFieldDurationComponent
} from "../../../../SharedModule/components/input-fields/input-field-duration/input-field-duration.component";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";

enum Tab {
  MEMBERS,
  INVITATIONS
}

@Component({
  selector: 'app-association-members-page-component',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    FaIconComponent,
    NgClass,
    FormsModule,
    UpdateUserModalComponent,
    SearchBoxComponent,
    SendInvitationModalComponent,
    ConfirmationModalComponent,
    TranslateModule,
    InputFieldDurationComponent,
    MultiColumnList
  ],
  templateUrl: './association-members-page.component.html',
  styleUrl: './association-members-page.component.css'
})
export class AssociationMembersPageComponent implements OnInit{
  associationID: string;
  selectedUser: UserAssociation | undefined;
  selectedRole: string | undefined;
  selectedInvite: AssociationInvite | undefined;
  userID: string | null;
  protected associationName: string = "";

  activeTab: Tab = Tab.MEMBERS;
  faTrashCan = faTrashCan;

  @ViewChild('memberHeaderTemplate', { static: true }) memberHeaderTemplate!: TemplateRef<any>;
  @ViewChild('roleHeaderTemplate', {static: true}) roleHeaderTemplate!: TemplateRef<any>;
  @ViewChild('memberSinceHeader', {static: true}) memberSinceHeader!: TemplateRef<any>;
  @ViewChild('actionsTemplate', {static: true}) actionsTemplateHeader!: TemplateRef<any>;

  @ViewChild('memberRowTemplate', { static: true }) memberRowTemplate!: TemplateRef<{ data: UserAssociation }>;
  @ViewChild('roleRowTemplate', {static: true}) roleRowTemplate!: TemplateRef<{ data: UserAssociation }>;
  @ViewChild('memberSinceRowTemplate', {static: true}) memberSinceRowTemplate!: TemplateRef<{ data: UserAssociation }>;
  @ViewChild('actionsRowTemplate', {static: true}) actionsRowTemplate!: TemplateRef<{ data: UserAssociation }>;


  @ViewChild('emailHeaderTemplate', {static: true}) emailHeaderTemplate!: TemplateRef<any>;
  @ViewChild('invitationSendHeaderTemplate', {static: true}) invitationSendHeaderTemplate!: TemplateRef<any>;
  @ViewChild('roleHeaderTemplate', {static: true}) invitationRoleHeaderTemplate!: TemplateRef<any>;


  @ViewChild('emailTemplate', {static: true}) emailTemplate!: TemplateRef<any>;
  @ViewChild('associationRoleTemplate', {static: true}) associationRoleTemplate!: TemplateRef<any>;
  @ViewChild('associationInviteCreatedAt', {static: true}) associationInviteCreatedAt!: TemplateRef<any>;
  @ViewChild('cancelButtonTemplate', {static: true}) cancelButtonTemplate!: TemplateRef<any>;



  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }


  constructor(
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    route: ActivatedRoute,
    protected modalService: ModalService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef) {
    this.associationID = route.snapshot.params['associationID'];

    this.graphQLCommunication.getAssociationName(this.associationID).then(r=>{
        navigationService.setSubTitle(r.name);
        this.associationName = r.name;
    })

    navigationService.showNavigation();
    this.translate.get('associationMembers.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.userID = this.authService.getUserID();
    this.graphQLCommunication.getAssociationMembers(this.associationID).then(r=>{
      this.dataSourceMembers.dataRows.next(r.users);
      this.dataSourceMembers.isDataLoading = false
    })

    this.graphQLCommunication.getAssociationInvites(this.associationID).then(r=>{
      this.dataSourceInvites.dataRows.next(r.invites);
      this.dataSourceInvites.isDataLoading = false
    })
  }

  protected readonly Tab = Tab;

  protected formatDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    return this.translate.get("config.language").pipe(
      map(locale => {
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      })
    );
  }
  public changeSelectedUser(user: UserAssociation) {
    this.selectedUser = user;
    this.selectedRole = user.associationRole.name;
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_MODIFY_MEMBER);
  }

  public deleteSelectedUser(user: UserAssociation) {
    this.selectedUser = user;
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER);
  }
  updateUserAssociation(userAssociation: UserAssociation) {
    let list = this.dataSourceMembers.dataRows.value;
    const index = list.findIndex(value => value.user.id === userAssociation.user.id)
    if (index !== -1) {
      list[index] = userAssociation;
      this.dataSourceMembers.dataRows.next(list)
    } else {
      // user association not found, zou niet moeteh gebeuren
    }
  }

  userAssociationDeleted(userAssociation: UserAssociation) {
    let list = this.dataSourceMembers.dataRows.value;
    const index = list.findIndex(value => value.user.id === userAssociation.user.id)
    if (index !== -1) {
      list.splice(index, 1);
      this.dataSourceMembers.dataRows.next(list);
    } else {
      // user association not found, zou niet moeteh gebeuren
    }
  }

  // searchUser(searchValue: string) {
  //   this.latestSearchParam = searchValue;
  //   this.filteredAssociations = this.userAssociations.filter(userAssociation => {
  //     return userAssociation.user.fullName.includes(searchValue) || userAssociation.user.email.includes(searchValue);
  //   });
  // }

  deleteSelectedInvite(inv: AssociationInvite) {
    this.selectedInvite = inv
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_DELETE_INVITE)
  }

  newAssociationInviteEvent(associationInvite: AssociationInvite) {
    console.log(associationInvite)
    let list = this.dataSourceInvites.dataRows.value;
    list.push(associationInvite);
    this.dataSourceInvites.dataRows.next(list);
  }

  protected readonly Modal = Modal;
  dataSourceMembers: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: false,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "associationMembers.searchPlaceholder",
    isInSearch: (dataRow : UserAssociation, searchValue : string) => {
      return dataRow.user.fullName.includes(searchValue) || dataRow.user.email.includes(searchValue);
    },
  };
  dataSourceInvites: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: false,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: false,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : AssociationInvite, searchValue : string) => {
      return dataRow.user.fullName.includes(searchValue) || dataRow.user.email.includes(searchValue);
    },
  };

  removeUser() {
    this.graphQLCommunication.deleteUserAssociation(this.associationID, this.selectedUser!.user.id)
      .then((changedUserDTO: DefaultBooleanResponseDTO) =>{
          if (changedUserDTO.success) {
            this.userAssociationDeleted(this.selectedUser!)
            const alert: AlertInfo = {
              duration: 4000,
              title: "Verwijderd",
              subTitle: this.selectedUser?.user.fullName + "is succesvol verwijderd uit de vereniging.",
              alertClass: AlertClass.CORRECT_CLASS,
              icon: AlertIcon.CHECK

            }
            this.alertService.showAlert(alert)

          }
      })
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
  }
  ngOnInit(): void {
    this.dataSourceMembers.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.memberHeaderTemplate,
        rowCell: this.memberRowTemplate,
        getRawValueToSort: (dataRow: UserAssociation) => {
          return dataRow.user.fullName;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.roleHeaderTemplate,
        rowCell: this.roleRowTemplate,
        getRawValueToSort: (dataRow: UserAssociation) => {
          return dataRow.associationRole.name;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.memberSinceHeader,
        rowCell: this.memberSinceRowTemplate,
        getRawValueToSort: (dataRow: UserAssociation) => {
          return dataRow.memberSince;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsTemplateHeader,
        rowCell: this.actionsRowTemplate,
      },
    ]
    this.dataSourceInvites.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.emailHeaderTemplate,
        rowCell: this.emailTemplate,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.user.fullName;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.invitationSendHeaderTemplate,
        rowCell: this.associationInviteCreatedAt,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.associationRole.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.invitationRoleHeaderTemplate,
        rowCell: this.associationRoleTemplate,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.createdAt
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsTemplateHeader,
        rowCell: this.cancelButtonTemplate,
      },
    ]
    this.cdr.detectChanges();
  }

  deleteInvite() {
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_DELETE_INVITE)
    if(this.selectedInvite == null) {
      return
    }
    this.graphQLCommunication.deleteAssociationInvite(this.selectedInvite.id).then((responseObject: DefaultBooleanResponseDTO) =>{
      if(responseObject.success) {
        let list = this.dataSourceInvites.dataRows.value


        const index = list.findIndex(value => value.id === this.selectedInvite!.id)
        if (index !== -1) {
          list.splice(index, 1);
        }
        this.dataSourceInvites.dataRows.next(list)
        const alert: AlertInfo = {
          duration: 4000,
          title: "Succesvol",
          subTitle: "De uitnodiging is succesvol ingetrokken.",
          alertClass: AlertClass.CORRECT_CLASS,
          icon: AlertIcon.CHECK

        }
        this.alertService.showAlert(alert)
      } else {
        // error message
        const alert: AlertInfo = {
          duration: 4000,
          title: "Error fout opgetreden",
          subTitle: "Er is iets misgegaan bij het intrekken van de uitnodiging.",
          alertClass: AlertClass.INCORRECT_CLASS,
          icon: AlertIcon.XMARK

        }
        this.alertService.showAlert(alert)
      }
    }).catch(e => {
      const alert: AlertInfo = {
        duration: 4000,
        title: "Error",
        subTitle: "Er is een fout opgetreden bij het intrekken van de uitnodiging.",
        alertClass: AlertClass.INCORRECT_CLASS,
        icon: AlertIcon.XMARK

      }
      this.alertService.showAlert(alert)
    });
  }
}
