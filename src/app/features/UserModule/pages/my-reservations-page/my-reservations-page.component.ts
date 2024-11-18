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
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {Reservation, ReservationUser} from "../../../../CoreModule/models/reservation.model";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {
  MyReservationDetailModalComponent
} from "../../modals/my-reservation-detail-modal/my-reservation-detail-modal.component";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";


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
    MultiColumnList
  ],
  templateUrl: './my-reservations-page.component.html',
  styleUrl: './my-reservations-page.component.css'
})
export class MyReservationsPageComponent implements OnInit {
  activeTab: Tab = Tab.FUTURE;
  protected readonly Tab = Tab;
  protected futureReservationsUsers : ReservationUser[] = []
  protected historyReservationsUsers : ReservationUser[] = []


  @ViewChild('MyReservationsTitleHeaderTemplate', { static: true }) myReservationsTitleHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsAssociationHeaderTemplate', {static: true}) myReservationsAssociationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsTimeHeaderTemplate', {static: true}) myReservationsTimeHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsDurationHeaderTemplate', {static: true}) myReservationsDurationHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsTrackHeaderTemplate', {static: true}) myReservationsTrackHeaderTemplate!: TemplateRef<any>;
  @ViewChild('MyReservationsPositionHeaderTemplate', {static: true}) myReservationsPositionHeaderTemplate!: TemplateRef<any>;


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
    hasMoreRows: false,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "Zoek reserveringen",
    isInSearch: (dataRow : ReservationUser, searchValue : string) => {
      return dataRow.reservation.title.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: ReservationUser) => {
      return dataRow.id.reservationId;
    },
  };

  ngOnInit(): void {

    this.refreshData()
  }

  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;
  SetCurrentReservationUser: EventEmitter<ReservationUser> = new EventEmitter();

  viewMoreInformation(reservationUser : ReservationUser) {
    this.SetCurrentReservationUser.emit(reservationUser);
    this.modalService.showModal(Modal.MY_RESERVATIONS_VIEW_DETAIL);
  }

  protected refreshData() {
    const startDate = this.util.toLocalIsoDateTime(new Date());
    this.graphQLCommunication.getMyReservations(startDate, "").then(response => {
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
      this.futureReservationsUsers = response.reservations.sort((a: ReservationUser, b: ReservationUser) => {
        return new Date(a.reservation.startDate).getTime() - new Date(b.reservation.startDate).getTime();
      });
    })
    this.graphQLCommunication.getMyReservations("", startDate).then(response => {
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
      this.historyReservationsUsers = response.reservations.sort((a: ReservationUser, b: ReservationUser) => {
        return new Date(b.reservation.startDate).getTime() - new Date(a.reservation.startDate).getTime();
      });
    })
  }
}
