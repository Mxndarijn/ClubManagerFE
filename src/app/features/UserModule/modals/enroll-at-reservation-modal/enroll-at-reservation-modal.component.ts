import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {Reservation} from "../../../../CoreModule/models/reservation.model";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";

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


  constructor(modalService: ModalService,
              private authService: AuthenticationService,
              protected util: UtilityFunctions) {
    super(Modal.ASSOCIATION_RESERVE_ENROLL_AT_RESERVATION, modalService);

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
  }

  isEnrolled() {
    const userKey = this.authService.getUserID();
    return this.reservation?.reservationUsers.some(u => u.id === userKey);
  }

  unrollAtReservation() {

  }
}
