import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {WeaponMaintenance} from "../../../../CoreModule/models/weapon-maintenance.model";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";

@Component({
  selector: 'app-weapon-information-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './weapon-information-modal.component.html',
  styleUrl: './weapon-information-modal.component.css'
})
export class WeaponInformationModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  protected selectedMaintenanceEvent : WeaponMaintenance | undefined
  @Input() changeSelectedEvent?: EventEmitter<WeaponMaintenance>
  @Input() changeCurrentWeaponMaintenance?: EventEmitter<WeaponMaintenance>;
  protected startTime = "";
  protected endTime = "";
  protected currentDate = new Date()


  constructor(
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private alertService: AlertService,
    protected util: UtilityFunctions
  ) {
    super(Modal.ASSOCIATION_WEAPON_INFORMATION, modalService);
    this.OnModalShowEvent.subscribe({
      next: () => {
        console.log(this.selectedMaintenanceEvent)
        this.title = this.selectedMaintenanceEvent?.title + " "
      }
    })
  }

  ngOnInit(): void {
    this.changeSelectedEvent?.subscribe({
      next: (event: WeaponMaintenance) => {
        this.selectedMaintenanceEvent = event;
        this.util.formatDateTimeAsString(event.startDate).then(t => this.startTime = t);
        this.util.formatDateTimeAsString(event.endDate).then(t => this.endTime = t);
      }
    })
  }

  ngOnDestroy(): void {

  }





  protected readonly Modal = Modal;

  timeIsAfterCurrentDate(startDate: string | undefined) {
    if(!startDate) {
      return false;
    }
    const startDateTime = new Date(startDate);
    return startDateTime.getTime() > this.currentDate.getTime();

  }
}
