import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {BehaviorSubject, map, Observable} from "rxjs";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {PermissionService} from "../../../../CoreModule/services/permission.service";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  UpdateUserModalComponent
} from "../../../AssociationModule/modals/update-user-modal/update-user-modal.component";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {faCircleXmark, faCircleCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-invitations-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FaIconComponent,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    UpdateUserModalComponent,
    ConfirmationModalComponent,
    MultiColumnList,
    TranslateModule,
    CustomButton
  ],
  templateUrl: './invitations-page.component.html',
  styleUrl: './invitations-page.component.css'
})
export class InvitationsPageComponent implements OnInit{
  associationInvites: AssociationInvite[] = [];


  @ViewChild('associationHeaderTemplate', { static: true }) associationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('receivedInvitationHeaderTemplate', {static: true}) receivedInvitationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('roleHeaderTemplate', {static: true}) roleHeaderTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', {static: true}) actionsTemplateHeader!: TemplateRef<any>;

  @ViewChild('associationRowTemplate', { static: true }) associationRowTemplate!: TemplateRef<{ data: AssociationInvite }>;
  @ViewChild('receivedInvitationRowTemplate', {static: true}) receivedInvitationRowTemplate!: TemplateRef<{ data: AssociationInvite }>;
  @ViewChild('roleRowTemplate', {static: true}) roleRowTemplate!: TemplateRef<{ data: AssociationInvite }>;
  @ViewChild('actionsRowTemplate', {static: true}) actionsRowTemplate!: TemplateRef<{ data: AssociationInvite }>;

  currentInvite?: AssociationInvite;

  dataSource: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: false,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: false,
    emptyMessage: "Er zijn geen uitnodigingen gevonden.",
    getID: (datatableRow: AssociationInvite) => datatableRow.id,
  };

  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private permissionService: PermissionService,
    private alertService: AlertService
  ) {
    navigationService.showNavigation();
    this.translate.get('invitationsPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLService.getUserInvites().then(invites => {
      this.dataSource.dataRows.next(invites);
      this.dataSource.isDataLoading = false;
      console.log(invites);
    });

  }

  ngOnInit(): void {
    this.dataSource.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.associationHeaderTemplate,
        rowCell: this.associationRowTemplate,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.association.name;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.receivedInvitationHeaderTemplate,
        rowCell: this.receivedInvitationRowTemplate,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.createdAt;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.roleHeaderTemplate,
        rowCell: this.roleRowTemplate,
        getRawValueToSort: (dataRow: AssociationInvite) => {
          return dataRow.associationRole;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsTemplateHeader,
        rowCell: this.actionsRowTemplate,
      },
    ]
  }

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

  protected readonly Modal = Modal;

  declineInvite(associationInviteId: string) {
    this.graphQLService.rejectAssociationInvite(associationInviteId)
      .then((dto: DefaultBooleanResponseDTO) => {
        if (dto.success) {
          this.associationInvites = this.associationInvites.filter(invite => invite.id !== associationInviteId);
          this.navigationService.refreshNavigation();
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Je hebt de uitnodiging afgewezen.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Probeer het later opnieuw.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      }).catch(e => {
      this.alertService.showAlert({
        title: "Fout opgetreden",
        subTitle: "Probeer het later opnieuw.",
        icon: AlertIcon.XMARK,
        duration: 4000,
        alertClass: AlertClass.INCORRECT_CLASS
      });
    })
  }

  acceptInvite(associationInviteId: string) {
    this.graphQLService.acceptAssociationInvite(associationInviteId)
      .then((dto: DefaultBooleanResponseDTO) => {
        if (dto.success) {
          this.associationInvites = this.associationInvites.filter(invite => invite.id !== associationInviteId);
          this.permissionService.refreshPermissions();
          this.navigationService.refreshNavigation();
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Je hebt de uitnodiging geaccepteert.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Probeer het later opnieuw.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      }).catch(e => {
      this.alertService.showAlert({
        title: "Fout opgetreden",
        subTitle: "Probeer het later opnieuw.",
        icon: AlertIcon.XMARK,
        duration: 4000,
        alertClass: AlertClass.INCORRECT_CLASS
      });
    })
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly faCircleXmark = faCircleXmark;
  protected readonly faCircleCheck = faCircleCheck;

  onClickAcceptInvite(invite: AssociationInvite) {
    this.currentInvite = invite;
    this.modalService.showModal(Modal.INVITATIONS_ACCEPT_ASSOCIATION_INVITE);
  }

  onClickDeclineInvite(invite: AssociationInvite) {
    this.currentInvite = invite;
    this.modalService.showModal(Modal.INVITATIONS_DECLINE_ASSOCIATION_INVITE)
  }

}
