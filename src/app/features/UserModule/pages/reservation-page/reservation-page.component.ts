import {Component, EventEmitter} from '@angular/core';
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {convertReservationToCalendarEvent, Reservation} from "../../../../CoreModule/models/reservation.model";
import {GetReservationsDTO} from "../../../../CoreModule/models/dto/get-reservations-between-dto";
import {SideBarComponent} from "../../../../SharedModule/components/navigation/side-bar/side-bar.component";
import {
  CalendarEvent,
  CalenderViewComponent
} from "../../../../SharedModule/components/calendar/calender-view/calender-view.component";
import {
  CalendarEventRegisterReservationComponent
} from "../../../../SharedModule/components/calendar/events/calendar-event-register-reservation/calendar-event-register-reservation.component";
import {
  EnrollAtReservationModalComponent
} from "../../../AssociationModule/modals/enroll-at-reservation-modal/enroll-at-reservation-modal.component";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [
    SideBarComponent,
    CalenderViewComponent,
    NgSwitchCase,
    NgSwitch,
    EnrollAtReservationModalComponent
  ],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css'
})
export class ReservationPageComponent {

  protected readonly Tab = Tab;
  protected activeTab = Tab.RESERVATIONS;
  updateWeaponCalendarEvent = new  EventEmitter<CalendarEvent[]>();
  updateReservationsCalendarEvent = new  EventEmitter<CalendarEvent[]>();
  private associationID: string;
  private calendarItems: CalendarEvent[] = [];
  private reservations: Reservation[] = [];


  constructor(
    private route : ActivatedRoute,
    private navigationService: NavigationService,
    private translate : TranslateService,
    private graphQLService: GraphQLCommunication,
    private modalService: ModalService
  ) {
    this.associationID = route.snapshot.params['associationID'];

    navigationService.showNavigation();
    this.translate.get('trackConfigurationPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLService.getAssociationName(this.associationID).then(r =>{
        navigationService.setSubTitle(r.name);
    })
  }

  updateWeaponEvents(date: Date) {

  }

  weaponCalendarItemClicked(event: CalendarEvent) {

  }

  createNewWeaponReservation() {

  }

  updateReservationEvent(date: Date) {
    this.graphQLService.getReservations(this.associationID, date).then((dto: GetReservationsDTO)=> {
        if (dto.success) {
          this.reservations = dto.reservations
          this.createCalendarItems(this.reservations);
          this.updateReservationsCalendarEvent?.next(this.calendarItems);
        } else {
          console.error("Could not request events")
        }

      }).catch(e => {
        console.error("Could not request events")
        console.error(e)
    })
  }

  reservationCalendarItemClicked(event: CalendarEvent) {
    this.SetCurrentReservation.emit(event.data as Reservation);
    this.modalService.showModal(Modal.ASSOCIATION_RESERVE_ENROLL_AT_RESERVATION);
  }


  createCalendarItems(list : Reservation[]) {
    const newEvents: CalendarEvent[] = []
    list.forEach(reservation => {
      newEvents.push(convertReservationToCalendarEvent(reservation))
    });

    this.calendarItems = newEvents;
  }

  protected readonly CalendarEventRegisterReservationComponent = CalendarEventRegisterReservationComponent;
  SetCurrentReservation = new EventEmitter<Reservation>;
}

enum Tab {
  RESERVATIONS= 0,
  WEAPONS= 1
}

