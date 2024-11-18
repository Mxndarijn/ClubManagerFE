import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {faEnvelope, faTrashCan, faPencil} from "@fortawesome/free-solid-svg-icons";
import {CreateWeaponModalComponent} from "../../modals/create-weapon-modal/create-weapon-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CreateTrackModalComponent} from "../../modals/create-track-modal/create-track-modal.component";
import {TranslateService} from "@ngx-translate/core";
import {
  CreateTrackReservationModalComponent
} from "../../modals/create-track-reservation-modal/create-track-reservation-modal.component";
import {
  ViewTrackReservationModalComponent
} from "../../modals/view-track-reservation-modal/view-track-reservation-modal.component";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {
  CalendarEvent,
  CalenderViewComponent
} from "../../../../SharedModule/components/calendar/calender-view/calender-view.component";
import {getWeaponStatus} from "../../../../CoreModule/models/weapon.model";
import {Track} from "../../../../CoreModule/models/track.model";
import {
  convertReservationToCalendarEvent,
  Reservation,
  ReservationRepeat,
  ReservationStatus
} from "../../../../CoreModule/models/reservation.model";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {GetReservationsDTO} from "../../../../CoreModule/models/dto/get-reservations-between-dto";
import {Association} from "../../../../CoreModule/models/association.model";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";

enum Tab {
  TRACKS,
  CALENDAR
}

@Component({
  selector: 'app-track-configuration-page',
  standalone: true,
  imports: [
    NgSwitchCase,
    NgSwitch,
    CreateWeaponModalComponent,
    FaIconComponent,
    NgForOf,
    NgIf,
    CreateTrackModalComponent,
    ConfirmationModalComponent,
    CalenderViewComponent,
    CreateTrackReservationModalComponent,
    ViewTrackReservationModalComponent,
    TabComponent,
    CustomButton,
    AsyncPipe,
    MultiColumnList
  ],
  templateUrl: './track-configuration-page.component.html',
  styleUrl: './track-configuration-page.component.css'
})
export class TrackConfigurationPageComponent implements OnInit {
  activeTab = Tab.TRACKS
  protected readonly Tab = Tab;
  protected readonly getWeaponStatus = getWeaponStatus;
  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;
  protected SetCurrentTrack = new EventEmitter<Track>();
  protected SetCurrentReservation = new EventEmitter<Reservation>();
  protected reservations: Reservation[] = []
  private associationID: string;

  private selectedTrack: Track | undefined;
  confirmModalMessage: string = "";
  updateCalendarItemsEvent = new EventEmitter<CalendarEvent[]>;
  private calendarItems: CalendarEvent[] = [];
  SetSelectedItemForView = new EventEmitter<CalendarEvent>();
  ReservationCreatedEvent = new EventEmitter<Reservation[]>;
  ReservationEditedEvent = new EventEmitter<Reservation[]>;
  ReservationDeleteEvent = new EventEmitter<Reservation[]>;

  @ViewChild('TrackNameHeader', { static: true }) trackNameHeader!: TemplateRef<any>;
  @ViewChild('DescriptionHeader', {static: true}) descriptionHeader!: TemplateRef<any>;
  @ViewChild('AllowedWeaponTypesHeader', {static: true}) allowedWeaponTypesHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;

  @ViewChild('TrackHeaderRow', {static: true}) trackHeaderRow!: TemplateRef<any>;

  @ViewChild('TrackNameRow', { static: true }) trackNameRow!: TemplateRef<{ data: Track }>;
  @ViewChild('TrackDescriptionRow', {static: true}) trackDescriptionRow!: TemplateRef<{ data: Track }>;
  @ViewChild('TrackWeaponTypesRow', {static: true}) trackWeaponTypesRow!: TemplateRef<{ data: Track }>;
  @ViewChild('TrackActionsRow', {static: true}) trackActionsRow!: TemplateRef<{ data: Track }>;

  dataSourceTrack: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : Track, searchValue : string) => {
      return dataRow.name.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: Track) => {
      return dataRow.id;
    },
  };


  constructor(
    protected modalService: ModalService,
    protected graphQLService: GraphQLCommunication,
    protected route: ActivatedRoute,
    private alertService: AlertService,
    navigationService: NavigationService,
    private translate: TranslateService,
    private graphQLCommunication: GraphQLCommunication
  ) {
    this.associationID = route.snapshot.params['associationID'];

    navigationService.showNavigation();
    this.translate.get('trackConfigurationPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLCommunication.getAssociationName(this.associationID).then(r =>{
        navigationService.setSubTitle(r.name);
    })
    this.graphQLService.getTracksOfAssociation(this.associationID).then( r =>{
      if(r == null) {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het ophalen van de banen..",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        return;
      }
      this.dataSourceTrack.dataRows.next(r)
      this.dataSourceTrack.isDataLoading = false
    })

    this.ReservationCreatedEvent.subscribe({
      next: (reservations: Reservation[]) => {
        reservations.forEach(r => {
          this.reservations.push(r);
        })
        this.createCalendarItems(this.reservations);
        this.updateCalendarItemsEvent.emit(this.calendarItems);
      }
    })
    //TODO other subscriptions

  }

  ngOnInit(): void {
    this.dataSourceTrack.headerRow = this.trackHeaderRow
    this.dataSourceTrack.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.trackNameHeader,
        rowCell: this.trackNameRow,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.descriptionHeader,
        rowCell: this.trackDescriptionRow,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.description;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.allowedWeaponTypesHeader,
        rowCell: this.trackWeaponTypesRow,
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.trackActionsRow,
      },
    ]
    }

  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Banen",
        onClick : () => {
          this.activeTab = Tab.TRACKS
        }
      },
      {
        label: "Kalender",
        onClick : () => {
          this.activeTab = Tab.CALENDAR
        }
      }
    ]
  };

  trackCreated(track: Track) {
    const list = this.dataSourceTrack.dataRows.value;
    list.push(track);
    this.dataSourceTrack.dataRows.next(list);
  }

  trackDeleted(track: Track) {
    const list = this.dataSourceTrack.dataRows.value.filter(t => t.id !== track.id);
    this.dataSourceTrack.dataRows.next(list);
  }

  trackEdited(track: Track) {
    const list = this.dataSourceTrack.dataRows.value.map(t => t.id === track.id ? track : t);
    this.dataSourceTrack.dataRows.next(list);
  }

  generateNewTrack(): Track {
    return {
      id: "",
      name: "",
      description: "",
      allowedWeaponTypes: []
    };
  }

  openModal(track: Track) {
    this.SetCurrentTrack.emit(track);
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_TRACK)
  }

  deleteTrack() {
    this.modalService.hideModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CONFIRM_DELETE)
    if (this.selectedTrack == null)
      return;
    this.graphQLService.deleteTrack(this.associationID, this.selectedTrack!).then( (rDTO:DefaultBooleanResponseDTO) =>{
        if (rDTO.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De baan is succesvol verwijderd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
          const list = this.dataSourceTrack.dataRows.value.filter(t => t.id !== t.id);
          this.dataSourceTrack.dataRows.next(list);
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het verwijderen van de baan.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
    })
  }

  startDeleteTrack(track: Track) {
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CONFIRM_DELETE);
    this.selectedTrack = track;
    this.confirmModalMessage = "Weet je zeker dat je baan " + this.selectedTrack.name + " wilt verwijderen?"

  }

  private lastUsedDate? : Date
  updateEvents(date: Date) {
    this.lastUsedDate = date;
    this.graphQLService.getReservations(this.associationID, date).then((dto: Association) => {
        if (dto.reservations != null) {
          this.reservations = dto.reservations
          this.createCalendarItems(this.reservations);
          this.updateCalendarItemsEvent?.next(this.calendarItems);


        } else {
          console.error("Could not request events")
          console.error(dto)
        }
    })
  }

  createCalendarItems(list: Reservation[]) {
    const newEvents: CalendarEvent[] = []
    list.forEach(reservation => {
      newEvents.push(convertReservationToCalendarEvent(reservation))
    });

    this.calendarItems = newEvents;
  }

  calendarItemClicked(item: CalendarEvent) {
    this.SetSelectedItemForView?.emit(item);
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_VIEW_RESERVATION);

  }

  createNewTrackReservation() {
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION)
    this.SetCurrentReservation.emit(this.generateNewReservation())
  }

  private generateNewReservation(): Reservation {
    return {
      membersCanChooseTheirOwnPosition: true,
      allowedWeaponTypes: [],
      association: undefined,
      id: "", maxSize: 1,
      tracks: [],
      reservationUsers: [],
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      status: ReservationStatus.IDK,
      reservationSeries: {
        id: "",
        reservations: [],
        reservationRepeat: ReservationRepeat.DAY,
        repeatDaysBetween: 1,
        repeatUntil: "",
      },
      openPositions: []
    };
  }

  refreshEvents() {
    if(this.lastUsedDate)
      this.updateEvents(this.lastUsedDate)
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly faPencil = faPencil;
}


