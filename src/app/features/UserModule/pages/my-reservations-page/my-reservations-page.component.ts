import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  UpdateUserModalComponent
} from "../../../AssociationModule/modals/update-user-modal/update-user-modal.component";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {faInfoCircle, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {ReservationUser} from "../../../../CoreModule/models/reservation.model";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {
  MyReservationDetailModalComponent
} from "../../modals/my-reservation-detail-modal/my-reservation-detail-modal.component";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";


enum Tab {
  FUTURE,
  HISTORY
}


@Component({
  selector: 'app-my-reservations-page',
  standalone: true,
  imports: [
    TranslateModule,
    AsyncPipe,
    ConfirmationModalComponent,
    FaIconComponent,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    UpdateUserModalComponent,
    MyReservationDetailModalComponent,
    TabComponent,
    MultiColumnList,
    CustomButton
  ],
  templateUrl: './my-reservations-page.component.html',
  styleUrl: './my-reservations-page.component.css'
})
export class MyReservationsPageComponent implements OnInit {
  activeTab: Tab = Tab.FUTURE;
  protected readonly Tab = Tab;
  protected futureReservationsUsers : ReservationUser[] = []
  protected historyReservationsUsers : ReservationUser[] = []
  startDate = this.util.toLocalIsoDateTime(new Date());


  @ViewChild('MyReservationsTitleHeaderTemplate', { static: true }) myReservationsTitleHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsAssociationHeaderTemplate', {static: true}) myReservationsAssociationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsTimeHeaderTemplate', {static: true}) myReservationsTimeHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsDurationHeaderTemplate', {static: true}) myReservationsDurationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsTrackHeaderTemplate', {static: true}) myReservationsTrackHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsPositionHeaderTemplate', {static: true}) myReservationsPositionHeaderTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', {static: true}) actionsTemplateHeader!: TemplateRef<any>;


  @ViewChild('MyReservationsTitleRowTemplate', { static: true }) myReservationsTitleRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('MyReservationsAssociationRowTemplate', {static: true}) myReservationsAssociationRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('MyReservationsTimeRowTemplate', {static: true}) myReservationsTimeRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('MyReservationsDurationRowTemplate', {static: true}) myReservationsDurationRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('MyReservationsTrackRowTemplate', {static: true}) myReservationsTrackRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('MyReservationsPositionRowTemplate', {static: true}) myReservationsPositionRowTemplate!: TemplateRef<{ data: ReservationUser }>;
  @ViewChild('actionsRowTemplate', {static: true}) actionsRowTemplate!: TemplateRef<{ data: ReservationUser }>;



  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Geplanned",
        onClick : () => {
          this.activeTab = Tab.FUTURE
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

  constructor(
    private graphQLCommunication: GraphQLCommunication,
    protected util: UtilityFunctions,
    private alertService : AlertService,
    private navigationService : NavigationService,
    private translate: TranslateService,
    private modalService: ModalService
  ) {
    navigationService.showNavigation();
    this.translate.get('myReservations.Title').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
  }
  dataSourcePlannedReservations: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: false,
    emptyMessage: "LEEG",
    searchPlaceholder: "Zoek reserveringen",
    getID: (dataRow: ReservationUser) => {
      return dataRow.id.reservationId;
    },
    loadAdditionalRows: async () => {
      return this.graphQLCommunication.getMyReservations(this.startDate, "", 20, this.dataSourcePlannedReservations.endCursor)
        .then(r => {
          this.dataSourcePlannedReservations.hasMoreRows = r.reservations.pageInfo.hasNextPage;
          this.dataSourcePlannedReservations.endCursor = r.reservations.pageInfo.endCursor;
          return r.reservations.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };

  dataSourceHistoryReservations: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: false,
    emptyMessage: "LEEG",
    searchPlaceholder: "Zoek reserveringen",
    getID: (dataRow: ReservationUser) => {
      return dataRow.id.reservationId;
    },
    loadAdditionalRows: async () => {
      return this.graphQLCommunication.getMyReservations("", this.startDate, 20, this.dataSourceHistoryReservations.endCursor)
        .then(r => {
          this.dataSourceHistoryReservations.hasMoreRows = r.reservations.pageInfo.hasNextPage;
          this.dataSourceHistoryReservations.endCursor = r.reservations.pageInfo.endCursor;
          return r.reservations.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };

  ngOnInit(): void {
    const data= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.myReservationsTitleHeaderTemplate,
        rowCell: this.myReservationsTitleRowTemplate,
        getRawValueToSort: (dataRow: ReservationUser) => {
          return dataRow.reservation.title;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.myReservationsAssociationHeaderTemplate,
        rowCell: this.myReservationsAssociationRowTemplate,
        getRawValueToSort: (dataRow: ReservationUser) => {
          return dataRow.reservation.association?.name;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.myReservationsTimeHeaderTemplate,
        rowCell: this.myReservationsTimeRowTemplate,
        getRawValueToSort: (dataRow: ReservationUser) => {
          return dataRow.reservation.startDate;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.myReservationsDurationHeaderTemplate,
        rowCell: this.myReservationsDurationRowTemplate,
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.myReservationsTrackHeaderTemplate,
        rowCell: this.myReservationsTrackRowTemplate,
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.myReservationsPositionHeaderTemplate,
        rowCell: this.myReservationsPositionRowTemplate,
      },
    ]
    this.dataSourceHistoryReservations.columns = data;
    this.dataSourcePlannedReservations.columns = [...data, {
      sortType: ColumnSortType.NONE,
      headerCell: this.actionsTemplateHeader,
      rowCell: this.actionsRowTemplate,
    }];
    this.refreshData()
  }

  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;
  protected readonly faInfoCircle = faInfoCircle;
  SetCurrentReservationUser: EventEmitter<ReservationUser> = new EventEmitter();

  viewMoreInformation(reservationUser : ReservationUser) {
    this.SetCurrentReservationUser.emit(reservationUser);
    this.modalService.showModal(Modal.MY_RESERVATIONS_VIEW_DETAIL);
  }

  protected refreshData() {
    this.graphQLCommunication.getMyReservations(this.startDate, "", 20, undefined).then(response => {
      if(response == null) {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er ging iets mis tijdens het ophalen van de gegevens.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        return
      }
      this.dataSourcePlannedReservations.hasMoreRows = response.reservations.pageInfo.hasNextPage;
      this.dataSourcePlannedReservations.endCursor = response.reservations.pageInfo.endCursor;
      this.dataSourcePlannedReservations.dataRows.next(response.reservations.edges.map((edge: any) => edge.node));
      this.dataSourcePlannedReservations.isDataLoading = false;
    })
    this.graphQLCommunication.getMyReservations("", this.startDate, 20, undefined).then(response => {
      if(response == null) {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er ging iets mis tijdens het ophalen van de gegevens.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        return
      }
      this.dataSourceHistoryReservations.hasMoreRows = response.reservations.pageInfo.hasNextPage;
      this.dataSourceHistoryReservations.endCursor = response.reservations.pageInfo.endCursor;
      this.dataSourceHistoryReservations.dataRows.next(response.reservations.edges.map((edge: any) => edge.node));
      this.dataSourceHistoryReservations.isDataLoading = false;
    })
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
}
