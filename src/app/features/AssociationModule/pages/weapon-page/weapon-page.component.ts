import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
  CalendarEvent,
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
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {Track} from "../../../../CoreModule/models/track.model";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";

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
    TabComponent,
    MultiColumnList,

  ],
  templateUrl: './weapon-page.component.html',
  styleUrl: './weapon-page.component.css'
})
export class WeaponPageComponent implements OnInit{
  activeTab: Tab = Tab.WEAPON_OVERVIEW;
  protected associationID: string;

  @ViewChild('WeaponNameHeader', { static: true }) weaponNameHeader!: TemplateRef<any>;
  @ViewChild('WeaponTypeHeader', {static: true}) weaponTypeHeader!: TemplateRef<any>;
  @ViewChild('WeaponStatusHeader', {static: true}) weaponStatusHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;

  @ViewChild('TableHeaderRow', {static: true}) tableHeaderRow!: TemplateRef<any>;

  @ViewChild('WeaponNameRow', { static: true }) weaponNameRow!: TemplateRef<{ data: Weapon }>;
  @ViewChild('WeaponTypeRow', {static: true}) weaponTypeRow!: TemplateRef<{ data: Weapon }>;
  @ViewChild('WeaponStatusRow', {static: true}) weaponStatusRow!: TemplateRef<{ data: Weapon }>;
  @ViewChild('ActionsRow', {static: true}) actionsRow!: TemplateRef<{ data: Weapon }>;


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
    this.graphQLCommunication.getAssociationName(this.associationID).then( r=> {
        navigationService.setSubTitle(r.name);
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

  ngOnInit(): void {
    this.dataSourceWeapons.headerRow = this.tableHeaderRow
    this.dataSourceWeapons.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.weaponNameHeader,
        rowCell: this.weaponNameRow,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.weaponTypeHeader,
        rowCell: this.weaponTypeRow,
        getRawValueToSort: (dataRow: Track) => {
          return dataRow.description;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.weaponStatusHeader,
        rowCell: this.weaponStatusRow,
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.actionsRow,
      },
    ]
    }

  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }

  protected readonly Tab = Tab;

  protected readonly faTrashCan = faTrashCan;

  createWeaponEvent(weapon: Weapon) {
    const list = this.dataSourceWeapons.dataRows.value;
    list.push(weapon)
    this.dataSourceWeapons.dataRows.next(list);
  }

  protected readonly Modal = Modal;

  private reloadData() {
    this.graphQLCommunication.getAllWeapons(this.associationID).then( r =>{
      this.dataSourceWeapons.dataRows.next(r)
      this.dataSourceWeapons.isDataLoading = false;
    }).catch(e => {
      this.alertService.showAlert({
        title: "Fout opgetreden",
        subTitle: "Wapens konden niet worden opgehaald.",
        icon: AlertIcon.XMARK,
        duration: 4000,
        alertClass: AlertClass.INCORRECT_CLASS
      });
    })
  }

  protected readonly WeaponStatus = WeaponStatus;
  protected readonly getWeaponStatus = getWeaponStatus;
  protected updateCalendarItemsEvent = new EventEmitter<CalendarEvent[]>();
  protected calendarItemClickedEvent?: EventEmitter<CalendarEvent>;
  selectedMaintenanceEvent?: WeaponMaintenance;
  changeSelectedWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  changeCurrentWeaponMaintenance: EventEmitter<WeaponMaintenance> = new EventEmitter<WeaponMaintenance>();
  protected addWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected changeWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected deleteWeaponMaintenanceEvent = new EventEmitter<WeaponMaintenance>();
  protected calendarItems: CalendarEvent[] = []
  setCurrentWeapon: EventEmitter<Weapon> = new EventEmitter<Weapon>();
  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Wapen overzicht",
        onClick : () => {
          this.activeTab = Tab.WEAPON_OVERVIEW
        }
      },
      {
        label: "Kalender",
        onClick : () => {
          this.activeTab = Tab.CALENDER_VIEW
        }
      }
    ]
  };

  dataSourceWeapons: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : Weapon, searchValue : string) => {
      return dataRow.name.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: Track) => {
      return dataRow.id;
    },
  };



  updateEvents(date: Date) {
    this.graphQLService.getAssociationMaintenances(this.associationID, date).then( (dto: GetWeaponMaintenancesDTO) => {
        if (dto.success) {
          const newEvents: CalendarEvent[] = []
          dto.maintenances.forEach(maintenance => {
            newEvents.push(this.convertWeaponMaintenanceToCalendarEvent(maintenance))
          });
          this.updateCalendarItemsEvent?.next(newEvents);
          this.calendarItems = newEvents;


        } else {
          console.error("Could not request events")
          console.error(dto)
        }
    })
  }

  calendarItemClicked(event: CalendarEvent) {
    this.selectedMaintenanceEvent = event.data as WeaponMaintenance;
    this.changeSelectedWeaponMaintenanceEvent.emit(this.selectedMaintenanceEvent)
    this.modalService.showModal(Modal.ASSOCIATION_WEAPON_INFORMATION)

  }

  createNewWeaponMaintenance() {

    this.changeCurrentWeaponMaintenance.emit(generateDefaultWeaponMaintenance());
    this.modalService.showModal(Modal.ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE)
  }

  convertWeaponMaintenanceToCalendarEvent(maintenance: WeaponMaintenance) : CalendarEvent {
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
    const list = this.dataSourceWeapons.dataRows.value;
    list.forEach(w => {
      if(w.id == weapon.id) {
        w.type = weapon.type;
        w.name = weapon.name;
        w.status = weapon.status;
      }
    })
    this.dataSourceWeapons.dataRows.next(list);
  }
}
