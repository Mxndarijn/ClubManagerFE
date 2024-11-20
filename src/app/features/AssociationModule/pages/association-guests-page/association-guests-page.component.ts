import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {CreateGuestModalComponent} from "../../modals/create-guest-modal/create-guest-modal.component";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {
  AssociationGuest,
  AssociationGuestStatus
} from "../../../../CoreModule/models/dto/association-guest-response-dto";
import {BehaviorSubject} from "rxjs";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {NgIf} from "@angular/common";
import {
  ReviewAssociationGuestModalComponent
} from "../../modals/review-association-guest-modal/review-association-guest-modal.component";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";

enum Tab {
  PRESENT= 0,
  HISTORY= 1
}


@Component({
  selector: 'app-association-guests-page',
  standalone: true,
  imports: [
    ConfirmationModalComponent,
    CreateGuestModalComponent,
    CustomButton,
    MultiColumnList,
    TabComponent,
    NgIf,
    ReviewAssociationGuestModalComponent
  ],
  templateUrl: './association-guests-page.component.html',
  styleUrl: './association-guests-page.component.css'
})
export class AssociationGuestsPageComponent implements OnInit {
  @ViewChild('topHeaderRowInvitations', { static: true }) topHeaderRowInvitations!: TemplateRef<any>;

  @ViewChild('GuestNameHeader', { static: true }) guestNameHeader!: TemplateRef<any>;
  @ViewChild('RequesterHeader', {static: true}) requesterHeader!: TemplateRef<any>;
  @ViewChild('StatusHeader', {static: true}) statusHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;
  @ViewChild('RequestDateHeader', {static: true}) requestDateHeader!: TemplateRef<any>;
  @ViewChild('DateHeader', {static: true}) dateHeader!: TemplateRef<any>;
  @ViewChild('ReviewerHeader', {static: true}) reviewerHeader!: TemplateRef<any>;

  @ViewChild('GuestNameRow', { static: true }) guestNameRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('RequesterRow', {static: true}) requesterRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('StatusRow', {static: true}) statusRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('ActionsRow', {static: true}) actionsRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('DateRow', {static: true}) dateRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('RequestDateRow', {static: true}) requestDateRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('ReviewerRow', {static: true}) reviewerRow!: TemplateRef<{ data: AssociationGuest }>;

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly faEnvelope = faEnvelope;
  dataSourceGuestsPresent: MultiColumnListDataSource = {
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
      return this.graphQLCommunication.getAssociationGuests(this.associationID, 20, this.dataSourceGuestsPresent.endCursor, "PENDING")
        .then(r => {
          console.log(r)
          this.dataSourceGuestsPresent.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuestsPresent.endCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    searchForAdditionalItems: async (search : string) => {
      return this.graphQLCommunication.getAssociationGuests(this.associationID, 20, this.dataSourceGuestsPresent.endCursor, "PENDING", search)
        .then(r => {
          this.dataSourceGuestsPresent.searchHasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuestsPresent.searchEndCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };
  dataSourceGuestsHistory: MultiColumnListDataSource = {
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
      return this.graphQLCommunication.getAssociationGuests(this.associationID, 20, this.dataSourceGuestsHistory.endCursor, undefined)
        .then(r => {
          console.log(r)
          this.dataSourceGuestsHistory.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuestsHistory.endCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node).filter((guest: AssociationGuest) => {
            return UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.APPROVED || UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.DENIED
          });
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    searchForAdditionalItems: async (search : string) => {
      return this.graphQLCommunication.getAssociationGuests(this.associationID, 20, this.dataSourceGuestsHistory.endCursor, undefined, search)
        .then(r => {
          this.dataSourceGuestsHistory.searchHasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuestsHistory.searchEndCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node).filter((guest: AssociationGuest) => {
            return UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.APPROVED || UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.DENIED
          });
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };

  associationID: string
  dataSourceTab: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Open Aanvragen",
        onClick : () => {
          this.activeTab = Tab.PRESENT
        }
      },
      {
        label: "Geschiedenis",
        onClick : () => {
          this.activeTab = Tab.HISTORY
        }
      }
    ]
  };
  protected activeTab = Tab.PRESENT;

  constructor(
    private route : ActivatedRoute,
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    protected modalService: ModalService,
  ) {
    this.associationID = route.snapshot.params['associationID'];
    this.graphQLCommunication.getAssociationName(this.associationID).then(r =>{
      navigationService.setSubTitle(r.name);
    })
    navigationService.setSubTitle("");

    navigationService.showNavigation();
    this.translate.get('association-guests.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLCommunication.getAssociationGuests(this.associationID, 20, this.dataSourceGuestsPresent.endCursor, "PENDING").then(r => {
      this.dataSourceGuestsPresent.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
      this.dataSourceGuestsPresent.endCursor = r.associationGuests.pageInfo.endCursor;
      this.dataSourceGuestsPresent.isDataLoading = false
      this.dataSourceGuestsPresent.dataRows.next(r.associationGuests.edges.map((edge: any) => edge.node));
    })

    this.graphQLCommunication.getAssociationGuests(this.associationID, 40, this.dataSourceGuestsHistory.endCursor, undefined).then(r => {
      console.log(r)
      this.dataSourceGuestsHistory.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
      this.dataSourceGuestsHistory.endCursor = r.associationGuests.pageInfo.endCursor;
      this.dataSourceGuestsHistory.isDataLoading = false
      this.dataSourceGuestsHistory.dataRows.next(r.associationGuests.edges.map((edge: any) => edge.node).filter((guest: AssociationGuest) => {
        return UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.APPROVED || UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) === AssociationGuestStatus.DENIED
      }));
      console.log(this.dataSourceGuestsHistory.dataRows.value)
    })



  }

  ngOnInit(): void {
    this.dataSourceGuestsPresent.headerRow = this.topHeaderRowInvitations;
    const data = [
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
        headerCell: this.requesterHeader,
        rowCell: this.requesterRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.requester.fullName;
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
      }
    ]
    this.dataSourceGuestsHistory.columns= [...data,
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.reviewerHeader,
        rowCell: this.reviewerRow,
      }]
    this.dataSourceGuestsPresent.columns= [...data,
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.actionsRow,
      },
    ]
    }

  protected readonly Tab = Tab;
  selectedAssociationGuest?: AssociationGuest;

  guestChanged(guest: AssociationGuest) {
    if(UtilityFunctions.convertToEnum(AssociationGuestStatus, guest.status) != AssociationGuestStatus.PENDING) {
      this.dataSourceGuestsPresent.dataRows.next(this.dataSourceGuestsPresent.dataRows.value.filter(a => { return a.id != guest.id}))
      this.dataSourceGuestsHistory.dataRows.next([...this.dataSourceGuestsHistory.dataRows.value.filter(a => { return a.id != guest.id}), guest])
    }

  }

  protected readonly Modal = Modal;
}
