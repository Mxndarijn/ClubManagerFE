import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ReservationUser} from "../../../../CoreModule/models/reservation.model";
import {Subscription} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-reservation-detail-modal',
  standalone: true,
  imports: [
    FormsModule,
    InputFieldSingleSelectComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './my-reservation-detail-modal.component.html',
  styleUrl: './my-reservation-detail-modal.component.css'
})
export class MyReservationDetailModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() SetCurrentReservationUser!: EventEmitter<ReservationUser>;
  @Output() UpdateReservationUsers = new EventEmitter<null>();

  protected currentReservationUser? : ReservationUser;

  constructor(modalService: ModalService,
              protected util: UtilityFunctions,
              private alertService : AlertService,
              private graphQLService : GraphQLCommunication,
              route: ActivatedRoute) {
    super(Modal.MY_RESERVATIONS_VIEW_DETAIL, modalService);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.subscriptions.push(this.SetCurrentReservationUser.subscribe({
      next: (data : ReservationUser) => {
        this.currentReservationUser = data;
      }
    }))
  }

  close() {
    this.hideModal()
  }

  unrollAtReservation() {
    if(this.currentReservationUser?.reservation != null) {
      this.graphQLService.enrollAtReservation(this.currentReservationUser.reservation.association!.id!, this.currentReservationUser.reservation.id, false, -1).then(data => {
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
        this.UpdateReservationUsers.emit(null);
        this.hideModal()
      })
    }
  }

}
