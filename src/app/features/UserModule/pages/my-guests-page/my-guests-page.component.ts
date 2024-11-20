import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {AssociationGuest} from "../../../../CoreModule/models/dto/association-guest-response-dto";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {
  CreateGuestModalComponent
} from "../../../AssociationModule/modals/create-guest-modal/create-guest-modal.component";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";

@Component({
  selector: 'app-my-guests-page',
  standalone: true,
  imports: [
    MultiColumnList,
    CreateGuestModalComponent,
    CustomButton,
    ConfirmationModalComponent,
    TranslateModule
  ],
  templateUrl: './my-guests-page.component.html',
  styleUrl: './my-guests-page.component.css'
})
export class MyGuestsPageComponent implements OnInit {

  @ViewChild('topHeaderRowInvitations', { static: true }) topHeaderRowInvitations!: TemplateRef<any>;


  @ViewChild('GuestNameHeader', { static: true }) guestNameHeader!: TemplateRef<any>;
  @ViewChild('AssociationHeader', {static: true}) associationHeader!: TemplateRef<any>;
  @ViewChild('StatusHeader', {static: true}) statusHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;
  @ViewChild('RequestDateHeader', {static: true}) requestDateHeader!: TemplateRef<any>;
  @ViewChild('DateHeader', {static: true}) dateHeader!: TemplateRef<any>;

  @ViewChild('GuestNameRow', { static: true }) guestNameRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('AssociationRow', {static: true}) associationRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('StatusRow', {static: true}) statusRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('ActionsRow', {static: true}) actionsRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('DateRow', {static: true}) dateRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('RequestDateRow', {static: true}) requestDateRow!: TemplateRef<{ data: AssociationGuest }>;
  selectedAssociationGuest?: AssociationGuest;

  constructor(
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    protected modalService: ModalService,
  ) {

    navigationService.setSubTitle("");

    navigationService.showNavigation();
    this.translate.get('my-guests.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.endCursor)
      .then(r => {
        console.log(r)
        this.dataSourceGuests.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
        this.dataSourceGuests.endCursor = r.associationGuests.pageInfo.endCursor;
        this.dataSourceGuests.isDataLoading = false
        this.dataSourceGuests.dataRows.next(r.associationGuests.edges.map((edge: any) => edge.node));
      })
      .catch(error => {
        console.error(error);
        return null;
      });

  }

  ngOnInit(): void {
    this.dataSourceGuests.headerRow = this.topHeaderRowInvitations;
    this.dataSourceGuests.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.guestNameHeader,
        rowCell: this.guestNameRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.guestFullName;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.dateHeader,
        rowCell: this.dateRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.eventTime;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.associationHeader,
        rowCell: this.associationRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.association.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.statusHeader,
        rowCell: this.statusRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.status;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.requestDateHeader,
        rowCell: this.requestDateRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.requestTime;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.actionsRow,
      },
    ]
  }

  /*
  * Introducee Naam
  * Vereniging
  * Status
  * Actions
  * */


  dataSourceGuests: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : AssociationGuest, searchValue : string) => {
      return dataRow.guestFullName.toLowerCase().includes(searchValue) || dataRow.guestResidence.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: UserPresence) => {
      return dataRow.id;
    },
    loadAdditionalRows: async () => {
      return this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.endCursor)
        .then(r => {
          this.dataSourceGuests.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuests.endCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    searchForAdditionalItems: async (search : string) => {
      return this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.searchEndCursor, search)
        .then(r => {
          this.dataSourceGuests.searchHasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuests.searchEndCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };


  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly Modal = Modal;
  protected readonly faEnvelope = faEnvelope;

  addAssociationGuest($event: AssociationGuest) {
    this.dataSourceGuests.dataRows.next([...this.dataSourceGuests.dataRows.value, $event]);

  }

  deleteAssociationGuest() {
    if(this.selectedAssociationGuest) {
      this.modalService.hideModal(Modal.GUEST_CANCEL_GUEST)
      this.graphQLCommunication.deleteAssociationGuest(this.selectedAssociationGuest.id, this.selectedAssociationGuest.association.id).then((response: DefaultBooleanResponseDTO) => {
        if(response.success) {
          this.dataSourceGuests.dataRows.next([...this.dataSourceGuests.dataRows.value.filter(a => { return a.id != this.selectedAssociationGuest!.id})])
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De Aanvraag is succesvol ingetrokken.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "De aanvraag kon niet worden ingetrokken.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      })
    }

  }
}
