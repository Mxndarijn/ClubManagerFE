import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {NgClass} from "@angular/common";
import {Modal, ModalService} from '../../services/modal.service';
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {AlertService} from "../../services/alert.service";
import {WeaponMaintenance} from "../../../model/weapon-maintenance.model";
import {UtilityFunctions} from "../../helpers/utility-functions";

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
export class WeaponInformationModalComponent extends DefaultModalInformation implements OnInit {
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



  protected readonly Modal = Modal;

  timeIsAfterCurrentDate(startDate: string | undefined) {
    if(!startDate) {
      return false;
    }
    const startDateTime = new Date(startDate);
    return startDateTime.getTime() > this.currentDate.getTime();

  }
}
