import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reservation, ReservationRepeat} from "../../../model/reservation.model";
import {Modal, ModalService} from "../../services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {AlertService} from "../../services/alert.service";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {WeaponType} from '../../../model/weapon-type.model';
import {Track} from "../../../model/track.model";
import {FormControl, FormGroup} from "@angular/forms";
import {DAYS_OF_WEEK} from "angular-calendar";
import {
  InputFieldWeaponModalComponent
} from "../../input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {TextareaModalComponent} from "../../input-fields/textarea-modal/textarea-modal.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-create-track-reservation-modal',
  standalone: true,
  imports: [
    InputFieldWeaponModalComponent,
    TextareaModalComponent,
    NgClass
  ],
  templateUrl: './create-track-reservation-modal.component.html',
  styleUrl: './create-track-reservation-modal.component.css'
})
export class CreateTrackReservationModalComponent extends DefaultModalInformation implements OnInit {

  private associationID: string;
  protected currentReservation?: Reservation;

  @Input() SetCurrentReservation!: EventEmitter<Reservation>;

  @Output() ReservationCreatedEvent = new EventEmitter<Reservation[]>
  @Output() ReservationEditedEvent = new EventEmitter<Reservation[]>
  @Output() ReservationDeleteEvent = new EventEmitter<Reservation[]>

  protected createReservationForm: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    weaponTypes: FormControl<WeaponType[] | null>;
    tracks: FormControl<Track[] | null>;
    startDate: FormControl<string | null>
    endDate: FormControl<string | null>
    maxSize: FormControl<number>

    repeats: FormControl<ReservationRepeat | undefined>
    repeatUntil: FormControl<string | undefined>
    repeatDays: FormControl<DAYS_OF_WEEK[] | undefined>
    repeatInteger: FormControl<number>
    repeatDaysBetween: FormControl<number>


  }>;

  private weaponTypeList: WeaponType[] = [];
  private tracksList: Track[] = [];


  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication,
    private alertService: AlertService
  ) {
    super(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION, modalService);
    this.associationID = route.snapshot.params['associationID'];

    this.graphQLService.getAllWeaponTypes(this.associationID).subscribe({
      next: (response) => {
        this.weaponTypeList = response.data.getAllWeaponTypes
      }
    })

    this.graphQLService.getTracksOfAssociation(this.associationID).subscribe({
      next: (response) => {
        this.tracksList = response.data.getTracksOfAssociation;
      }
    })

    // @ts-ignore
    this.createReservationForm = new FormGroup({
      title: new FormControl(""),
      description: new FormControl(""),
      weaponTypes: new FormControl([]),
      tracks: new FormControl([]),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      maxSize: new FormControl(1),
      repeats: new FormControl(ReservationRepeat.NO_REPEAT),
      repeatUntil: new FormControl(""),
      repeatDays: new FormControl(""),
      repeatInteger: new FormControl(0),
      repeatDaysBetween: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.SetCurrentReservation.subscribe({
      next: (reservation: Reservation) => {
        this.currentReservation = reservation;
        this.createReservationForm.patchValue({
          title: this.currentReservation?.title,
          description: this.currentReservation?.description,
          weaponTypes: this.currentReservation?.allowedWeaponTypes,
          tracks: this.currentReservation?.tracks,
          startDate: this.currentReservation?.startDate,
          endDate: this.currentReservation?.endDate,
          maxSize: this.currentReservation?.maxSize,
          repeats: this.currentReservation.reservationSerie?.reservationRepeat,
          repeatUntil: this.currentReservation?.reservationSerie?.repeatUntil,
          repeatDays: this.currentReservation?.reservationSerie?.repeatDays,
          repeatInteger: this.currentReservation?.reservationSerie?.repeatInteger,
          repeatDaysBetween: this.currentReservation?.reservationSerie?.repeatDaysBetween
        });
      }
    })
  }
}
