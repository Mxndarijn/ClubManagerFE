import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormsModule, Validators} from "@angular/forms";
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
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";

@Component({
  selector: 'app-enroll-at-reservation-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgForOf,
    InputFieldSingleSelectComponent
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
  selectPosition: FormControl<number | null>;
  NewItemsEvent: EventEmitter<any[]> = new EventEmitter;
  items : any[] = []


  constructor(modalService: ModalService,
              private authService: AuthenticationService,
              private alertService: AlertService,
              private graphQLService : GraphQLCommunication,
              private route: ActivatedRoute,
              protected util: UtilityFunctions,
              private auth : AuthenticationService) {
    super(Modal.ASSOCIATION_RESERVE_ENROLL_AT_RESERVATION, modalService);
    this.associationID = route.snapshot.params['associationID'];
    this.selectPosition = new FormControl(null, Validators.required)

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
        this.reservation.reservationUsers = []
        this.graphQLService.getAssociationReservation(this.associationID, value.id, this.auth.getUserID()!).then(data => {
          console.log(data)
          if(data.success == true) {
            this.reservation = data.reservation;
            this.NewItemsEvent.emit(this.reservation!.openPositions);
            this.items = this.reservation!.openPositions
          } else {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Er ging iets mis tijdens het ophalen van de reservering.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }
        })
        this.subscriptions.push(
          this.util.formatDateTimeAsString(value.startDate).subscribe({
            next: (r) => this.startTime = r,
            error: (err) => console.error('Error formatting start date', err)
          })
        );

        this.subscriptions.push(
          this.util.formatDateTimeAsString(value.endDate).subscribe({
            next: (r) => this.endTime = r,
            error: (err) => console.error('Error formatting end date', err)
          })
        );
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
      console.log(this.selectPosition)
      console.log(this.selectPosition.value)
      const position = this.selectPosition.value != null ? this.selectPosition.value! : -1
      this.graphQLService.enrollAtReservation(this.associationID, this.reservation.id, true, position).then(data => {
        console.log(data)
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
      return u.id.userId === userKey
    });
  }

  updateReservation(reservation : Reservation) {
    if(this.reservation != null) {
      this.reservation.reservationUsers = reservation?.reservationUsers || [];
    }
  }

  unrollAtReservation() {
    if(this.reservation != null) {
      this.graphQLService.enrollAtReservation(this.associationID, this.reservation.id, false, -1).then(data => {
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

  convertNumberToText(input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(input + 1);
    });
  }
}
