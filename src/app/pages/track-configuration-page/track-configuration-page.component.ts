import {Component, EventEmitter} from '@angular/core';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {getWeaponStatus} from "../../CoreModule/models/weapon.model";
import {Modal, ModalService} from "../../CoreModule/services/modal.service";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {CreateWeaponModalComponent} from "../../modals/create-weapon-modal/create-weapon-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CreateTrackModalComponent} from "../../modals/create-track-modal/create-track-modal.component";
import {Track} from "../../CoreModule/models/track.model";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";
import {DefaultBooleanResponseDTO} from "../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";
import {AlertService} from '../../CoreModule/services/alert.service';
import {ConfirmationModalComponent} from "../../modals/confirmation-modal/confirmation-modal.component";
import {CalenderEvent, CalenderViewComponent} from "../../calender/calender-view/calender-view.component";
import {NavigationService} from "../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {
  convertReservationToCalendarEvent,
  Reservation,
  ReservationRepeat,
  ReservationStatus
} from "../../CoreModule/models/reservation.model";
import {
  CreateTrackReservationModalComponent
} from "../../modals/create-track-reservation-modal/create-track-reservation-modal.component";
import {GetWeaponMaintenancesDTO} from "../../CoreModule/models/dto/get-reservations-between-dto";
import {
  ViewTrackReservationModalComponent
} from "../../modals/view-track-reservation-modal/view-track-reservation-modal.component";

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
    ViewTrackReservationModalComponent
  ],
  templateUrl: './track-configuration-page.component.html',
  styleUrl: './track-configuration-page.component.css'
})
export class TrackConfigurationPageComponent {
  protected activeTab = Tab.TRACKS
  protected readonly Tab = Tab;
  protected readonly getWeaponStatus = getWeaponStatus;
  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;
  protected SetCurrentTrack = new EventEmitter<Track>();
  protected SetCurrentReservation = new EventEmitter<Reservation>();
  protected tracks: Track[] = []
  protected reservations: Reservation[] = []
  private associationID: string;

  private selectedTrack: Track | undefined;
  confirmModalMessage: string = "";
  updateCalendarItemsEvent = new EventEmitter<CalenderEvent[]>;
  private calendarItems: CalenderEvent[] = [];
  SetSelectedItemForView = new EventEmitter<CalenderEvent>();
  ReservationCreatedEvent = new EventEmitter<Reservation[]>;
  ReservationEditedEvent = new EventEmitter<Reservation[]>;
  ReservationDeleteEvent = new EventEmitter<Reservation[]>;


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
    this.graphQLCommunication.getAssociationName(this.associationID).subscribe({
      next: (response) => {
        navigationService.setSubTitle(response.data.getAssociationDetails.name);
      }
    })
    this.graphQLService.getTracksOfAssociation(this.associationID).subscribe({
      next: (response) => {
        this.tracks = response.data.getTracksOfAssociation;
      }
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

  trackCreated(track: Track) {
    this.tracks.push(track);
  }

  trackDeleted(track: Track) {
    this.tracks = this.tracks.filter(t => t.id !== track.id);
  }

  trackEdited(track: Track) {
    this.tracks = this.tracks.map(t => t.id === track.id ? track : t);

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
    this.graphQLService.deleteTrack(this.associationID, this.selectedTrack!).subscribe({
      next: (response) => {
        const rDTO = response.data.deleteTrackForAssociation as DefaultBooleanResponseDTO;
        if (rDTO.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De baan is succesvol verwijderd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
          this.tracks = this.tracks.filter(t => t.id != this.selectedTrack!.id)
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het verwijderen van de baan.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });

        }
      }
    })
  }

  startDeleteTrack(track: Track) {
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CONFIRM_DELETE);
    this.selectedTrack = track;
    this.confirmModalMessage = "Weet je zeker dat je baan " + this.selectedTrack.name + " wilt verwijderen?"

  }

  updateEvents(date: Date) {
    this.graphQLService.getReservations(this.associationID, date).subscribe({
      next: (response) => {
        console.log(response)
        const dto = response.data.getReservationsBetween as GetWeaponMaintenancesDTO;
        if (dto.success) {
          this.reservations = dto.reservations
          this.createCalendarItems(this.reservations);
          this.updateCalendarItemsEvent?.next(this.calendarItems);


        } else {
          console.error("Could not request events")
          console.error(response)
        }

      }
    })
  }

  createCalendarItems(list: Reservation[]) {
    const newEvents: CalenderEvent[] = []
    list.forEach(reservation => {
      newEvents.push(convertReservationToCalendarEvent(reservation))
    });

    this.calendarItems = newEvents;
  }

  calendarItemClicked(item: CalenderEvent) {
    this.SetSelectedItemForView?.emit(item);
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_VIEW_RESERVATION);

  }

  createNewTrackReservation() {
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION)
    this.SetCurrentReservation.emit(this.generateNewReservation())
  }

  private generateNewReservation(): Reservation {
    return {
      allowedWeaponTypes: [],
      association: undefined,
      id: "", maxSize: 1,
      tracks: [],
      users: [],
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      status: ReservationStatus.IDK,
      reservationSerie: {
        id: "",
        reservations: [],
        reservationRepeat: ReservationRepeat.DAILY,
        repeatDaysBetween: 1,
        repeatUntil: "",
      },
    };
  }

}

enum Tab {
  TRACKS = 0,
  CALENDAR = 1
}
