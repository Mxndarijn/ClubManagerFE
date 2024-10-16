import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {WeaponMaintenance} from "../../../../CoreModule/models/weapon-maintenance.model";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {Subscription} from "rxjs";

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
  private subscriptions: Subscription[] = [];


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
    if(this.changeSelectedEvent != null) {
      this.subscriptions.push(this.changeSelectedEvent.subscribe({
        next: (event: WeaponMaintenance) => {
          this.selectedMaintenanceEvent = event;
          this.subscriptions.push(
            this.util.formatDateTimeAsString(event.startDate).subscribe({
              next: (r) => this.startTime = r,
              error: (err) => console.error('Error formatting start date', err)
            })
          );

          this.subscriptions.push(
            this.util.formatDateTimeAsString(event.endDate).subscribe({
              next: (r) => this.endTime = r,
              error: (err) => console.error('Error formatting end date', err)
            })
          );
        }
      }));
    }

    }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
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
