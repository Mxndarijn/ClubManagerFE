import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {CalendarEvent} from "../../../../SharedModule/components/calendar/calender-view/calender-view.component";
import {Reservation} from "../../../../CoreModule/models/reservation.model";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";

@Component({
  selector: 'app-view-track-reservation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './view-track-reservation-modal.component.html',
  styleUrl: './view-track-reservation-modal.component.css'
})
export class ViewTrackReservationModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = []
  private associationID: string;

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  protected selected?: CalendarEvent;
  private currentDate = new Date();
  @Input() SetSelectedItem!: EventEmitter<CalendarEvent>;
  @Input() SetEditingReservation!: EventEmitter<Reservation>;

  @Output() RefreshEvents = new EventEmitter<null>();

  constructor(
    private modalService: ModalService,
    private graphQL : GraphQLCommunication,
    protected route: ActivatedRoute,
    private alertService : AlertService,
  ) {
    super(Modal.ASSOCIATION_CONFIGURE_TRACK_VIEW_RESERVATION, modalService);
    this.associationID = route.snapshot.params['associationID'];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetSelectedItem.subscribe({
      next: (i: CalendarEvent) => {
        this.selected = i;
      }
    }))
  }

  timeIsAfterCurrentDate(startDate: Date) {
    if(!startDate) {
      return false;
    }
    return startDate.getTime() > this.currentDate.getTime();

  }

  editReservation() {
    console.log(this.selected)
    if (!this.timeIsAfterCurrentDate(this.selected?.endDate!))
      return;
    this.SetEditingReservation.emit(this.selected?.data);
    this.hideModal()
    this.modalService.showModal(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION)
  }

  deleteReservation() {
    const res : Reservation = this.selected?.data;
    this.graphQL.deleteReservation(res.id, this.associationID).then(res => {
      if(res.success) {
        this.alertService.showAlert({
          title: "Succesvol",
          subTitle: "De reservering is succesvol verwijderd.",
          icon: AlertIcon.CHECK,
          duration: 4000,
          alertClass: AlertClass.CORRECT_CLASS
        });
        this.hideModal()
        this.RefreshEvents.emit()
      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het verwijderen van de reservering.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        this.hideModal()
      }
    })
  }

  deleteReservationSeries() {
    const res : Reservation = this.selected?.data;
    if(res.reservationSerie?.id == null) {
      this.hideModal()
      return;
    }
    this.graphQL.deleteReservationSeries(res.reservationSerie.id, this.associationID).then(res => {
      if(res.success) {
        this.alertService.showAlert({
          title: "Succesvol",
          subTitle: "De reservering serie is succesvol verwijderd.",
          icon: AlertIcon.CHECK,
          duration: 4000,
          alertClass: AlertClass.CORRECT_CLASS
        });
        this.hideModal()
        this.RefreshEvents.emit()
      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het verwijderen van de reservering serie.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        this.hideModal()
      }
    })
  }
}
