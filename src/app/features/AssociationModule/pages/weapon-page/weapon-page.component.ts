import {Component, EventEmitter} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SendInvitationModalComponent} from "../../modals/send-invitation-modal/send-invitation-modal.component";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute} from "@angular/router";
import {CreateWeaponModalComponent} from "../../modals/create-weapon-modal/create-weapon-modal.component";
import {
  WeaponInformationModalComponent
} from "../../modals/weapon-information-modal/weapon-information-modal.component";
import {
  WeaponMaintenanceCreateEditModalComponent
} from "../../modals/weapon-maintenance-create-edit-modal/weapon-maintenance-create-edit-modal.component";
import {
  CalenderEvent,
  CalenderViewComponent
} from "../../../../SharedModule/components/calendar/calender-view/calender-view.component";
import {UpdateButtonComponent} from "../../../../SharedModule/components/buttons/update-button/update-button.component";
import {getWeaponStatus, Weapon, WeaponStatus} from "../../../../CoreModule/models/weapon.model";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {
  generateDefaultWeaponMaintenance,
  WeaponMaintenance
} from "../../../../CoreModule/models/weapon-maintenance.model";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {GetWeaponMaintenancesDTO} from "../../../../CoreModule/models/dto/get-weapon-maintenances-dto";

enum Tab {
  WEAPON_OVERVIEW,
  CALENDER_VIEW
}

@Component({
  selector: 'app-weapon-page',
  standalone: true,
  imports: [
    TranslateModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    SendInvitationModalComponent,
    FaIconComponent,
    CreateWeaponModalComponent,
    CalenderViewComponent,
    UpdateButtonComponent,
    WeaponInformationModalComponent,
    WeaponMaintenanceCreateEditModalComponent,

  ],
  templateUrl: './weapon-page.component.html',
  styleUrl: './weapon-page.component.css'
})
export class WeaponPageComponent {
  activeTab: Tab = Tab.WEAPON_OVERVIEW;
  weaponList: Weapon[] = [];
  protected associationID: string;


  constructor(
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    private graphQLService: GraphQLCommunication,
    route: ActivatedRoute,
    protected modalService: ModalService,
  ) {
    this.associationID = route.snapshot.params['associationID'];

    navigationService.showNavigation();
    this.translate.get('weaponsPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLCommunication.getAssociationName(this.associationID).subscribe({
      next: (response) => {
        navigationService.setSubTitle(response.data.getAssociationDetails.name);
      }
    })

    this.addWeaponMaintenanceEvent.subscribe({
      next: (i: WeaponMaintenance) => {
        this.calendarItems.push(this.convertWeaponMaintenanceToCalendarEvent(i))
        this.updateCalendarItemsEvent?.next(this.calendarItems);

      }
    })
    this.changeWeaponMaintenanceEvent.subscribe({
      next: (i: WeaponMaintenance) => {
        this.calendarItems = this.calendarItems.filter(c => c.id != i.id)
        this.calendarItems.push(this.convertWeaponMaintenanceToCalendarEvent(i))
        this.updateCalendarItemsEvent?.next(this.calendarItems);

      }
    })
    this.deleteWeaponMaintenanceEvent.subscribe({
      next: (i: WeaponMaintenance) => {
        this.calendarItems = this.calendarItems.filter(c => c.id != i.id)
        this.updateCalendarItemsEvent?.next(this.calendarItems);

      }
    })
    this.reloadData();
  }


  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }

  protected readonly Tab = Tab;

  protected readonly faTrashCan = faTrashCan;

  createWeaponEvent(weapon: Weapon) {
    this.weaponList.push(weapon);
  }

  protected readonly Modal = Modal;

  private reloadData() {
    this.graphQLCommunication.getAllWeapons(this.associationID).subscribe({
      next: (response) => {
        this.weaponList = response.data.getAllWeapons
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Wapens konden niet worden opgehaald.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })
  }

  protected readonly WeaponStatus = WeaponStatus;
  protected readonly getWeaponStatus = getWeaponStatus;
  protected updateCalendarItemsEvent = new EventEmitter<CalenderEvent[]>();
  protected calendarItemClickedEvent?: EventEmitter<CalenderEvent>;
  selectedMaintenanceEvent?: WeaponMaintenance;
  changeSelectedWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  changeCurrentWeaponMaintenance: EventEmitter<WeaponMaintenance> = new EventEmitter<WeaponMaintenance>();
  protected addWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected changeWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected deleteWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected calendarItems: CalenderEvent[] = []
  setCurrentWeapon: EventEmitter<Weapon> = new EventEmitter<Weapon>();

  updateEvents(date: Date) {
    this.graphQLService.getAssociationMaintenances(this.associationID, date).subscribe({
      next: (response) => {
        const dto: GetWeaponMaintenancesDTO = response.data.getWeaponMaintenancesBetween;
        if (dto.success) {
          const newEvents: CalenderEvent[] = []
          dto.maintenances.forEach(maintenance => {
            newEvents.push(this.convertWeaponMaintenanceToCalendarEvent(maintenance))
          });
          this.updateCalendarItemsEvent?.next(newEvents);
          this.calendarItems = newEvents;


        } else {
          console.error("Could not request events")
          console.error(response)
        }

      }
    })
  }

  calendarItemClicked(event: CalenderEvent) {
    this.selectedMaintenanceEvent = event.data as WeaponMaintenance;
    this.changeSelectedWeaponMaintenanceEvent.emit(this.selectedMaintenanceEvent)
    this.modalService.showModal(Modal.ASSOCIATION_WEAPON_INFORMATION)

  }

  createNewWeaponMaintenance() {

    this.changeCurrentWeaponMaintenance.emit(generateDefaultWeaponMaintenance());
    this.modalService.showModal(Modal.ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE)
  }

  convertWeaponMaintenanceToCalendarEvent(maintenance: WeaponMaintenance) : CalenderEvent {
    const s = new Date();
    s.setSeconds(0,0);

    const e = new Date();
    e.setSeconds(0,0);
    return {
      title: maintenance!.title!,
      description: maintenance!.description!,
      id: maintenance.id!,
      color: maintenance.colorPreset!,
      data: maintenance,
      width: 100,
      columnIndex: -1,
      startDate: maintenance.startDate != null && maintenance.startDate.length > 0 ? new Date(maintenance!.startDate!) : s,
      endDate: maintenance.endDate != null && maintenance.endDate.length > 0 ? new Date(maintenance!.endDate!) : e
    }

  }

  generateNewWeapon() {
    return {
      status: "",
      type: {},
      name: "",
      id: ""
    } as Weapon;
  }

  changeWeaponEvent(weapon: Weapon) {
    this.weaponList.forEach(w => {
      if(w.id == weapon.id) {
        w.type = weapon.type;
        w.name = weapon.name;
        w.status = weapon.status;
      }
    })
  }
}