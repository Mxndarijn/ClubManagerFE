import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {Reservation} from "../../../../CoreModule/models/reservation.model";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";

@Component({
  selector: 'app-enroll-at-reservation-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './enroll-at-reservation-modal.component.html',
  styleUrl: './enroll-at-reservation-modal.component.css'
})
export class EnrollAtReservationModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private currentDate = new Date();
  @Input() setCurrentReservation!: EventEmitter<Reservation>;
  protected reservation?: Reservation;
  startTime: string = "";
  endTime: string = "";
  private associationID : string;


  constructor(modalService: ModalService,
              private authService: AuthenticationService,
              private alertService: AlertService,
              private graphQLService : GraphQLCommunication,
              private route: ActivatedRoute,
              protected util: UtilityFunctions) {
    super(Modal.ASSOCIATION_RESERVE_ENROLL_AT_RESERVATION, modalService);
    this.associationID = route.snapshot.params['associationID'];

  }

  ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
          s.unsubscribe();
        })
    }

  ngOnInit(): void {
    this.subscriptions.push(this.setCurrentReservation.subscribe({
      next: (value: Reservation) => {
        this.reservation = value;
        this.util.formatDateTime(new Date(value.startDate)).then(r => this.startTime = r);
        this.util.formatDateTime(new Date(value.endDate)).then(r => this.endTime = r);

        console.log(value)
      }
    }));
  }

  timeIsAfterCurrentDate(startDate: string) {
    if (!startDate) {
      return false;
    }
    return new Date(startDate).getTime() > this.currentDate.getTime();

  }

  enrollAtReservation() {
    if(this.reservation != null) {
      this.graphQLService.enrollAtReservation(this.associationID, this.reservation.id, true).then(data => {
        if(data.success == true) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Successvol aangemeld voor reservatie.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er ging iets mis tijdens het aanmelden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
        this.updateReservation(data.reservation);
        this.hideModal()
      })
    }
  }

  isEnrolled() {
    const userKey = this.authService.getUserID();
    return this.reservation?.reservationUsers.some(u => {
      console.log(u)
      return u.id.userId === userKey
    });
  }

  updateReservation(reservation : Reservation) {
    if(this.reservation != null) {
      this.reservation.reservationUsers = reservation.reservationUsers;
    }
  }

  unrollAtReservation() {
    if(this.reservation != null) {
      this.graphQLService.enrollAtReservation(this.associationID, this.reservation.id, false).then(data => {
        if(data.success == true) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "Successvol afgemeld voor reservatie.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er ging iets mis tijdens het afmelden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
        this.updateReservation(data.reservation);
        this.hideModal()
      })
    }
  }
}
