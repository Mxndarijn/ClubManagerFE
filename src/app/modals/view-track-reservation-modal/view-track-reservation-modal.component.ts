import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultModalInformation} from "../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../CoreModule/services/modal.service";
import {CalenderEvent} from "../../calender/calender-view/calender-view.component";
import {Reservation} from "../../CoreModule/models/reservation.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  protected selected?: CalenderEvent;
  private currentDate = new Date();
  @Input() SetSelectedItem!: EventEmitter<CalenderEvent>;
  @Input() SetEditingReservation!: EventEmitter<Reservation>;

  constructor(private modalService: ModalService) {
    super(Modal.ASSOCIATION_CONFIGURE_TRACK_VIEW_RESERVATION, modalService);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.SetSelectedItem.subscribe({
      next: (i: CalenderEvent) => {
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
}
