import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {BarcodeFormat} from "@zxing/library";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {
  AssociationPresenceCreateComponent
} from "../../modals/association-presence-create/association-presence-create.component";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {ButtonClass, CustomButton} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";


enum Tab {
  CREATE_PRESENCE,
  HISTORY_PRESENCE,
}

@Component({
  selector: 'app-association-presence',
  standalone: true,
  imports: [
    ZXingScannerModule,
    NgIf,
    SearchBoxComponent,
    NgForOf,
    ConfirmationModalComponent,
    AssociationPresenceCreateComponent,
    TabComponent,
    AsyncPipe,
    MultiColumnList,
    CustomButton,
    TranslateModule
  ],
  templateUrl: './association-presence.component.html',
  styleUrl: './association-presence.component.css'
})
export class AssociationPresenceComponent implements OnInit{
  torchEnabled = false;
  torchCompatible = false;
  formats: BarcodeFormat[] = [BarcodeFormat.CODE_39];
  deviceCurrent: MediaDeviceInfo | undefined;
  availableDevices: MediaDeviceInfo[] | undefined;
  deviceSelected: string | undefined;

  hasDevices?: boolean;
  hasPermission?: boolean;

  currentSelected? : UserAssociation

  result : string = ""
  private associationID: string;
  resultList : UserAssociation[] = []

  @ViewChild('MemberHeader', { static: true }) memberHeader!: TemplateRef<any>;
  @ViewChild('DateHeader', {static: true}) dateHeader!: TemplateRef<any>;
  @ViewChild('ApprovedUserHeader', {static: true}) approvedUserHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;

  @ViewChild('MemberRow', { static: true }) memberRow!: TemplateRef<{ data: UserPresence }>;
  @ViewChild('DateRow', {static: true}) dateRow!: TemplateRef<{ data: UserPresence }>;
  @ViewChild('ApprovedUserRow', {static: true}) approvedUserRow!: TemplateRef<{ data: UserPresence }>;
  @ViewChild('ActionsRow', {static: true}) actionsRow!: TemplateRef<{ data: UserPresence }>;

  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Presentie toevoegen",
        onClick : () => {
          this.activeTab = Tab.CREATE_PRESENCE
        }
      },
      {
        label: "Historie",
        onClick : () => {
          this.activeTab = Tab.HISTORY_PRESENCE
        }
      }
    ]
  };
  protected activeTab: Tab = Tab.CREATE_PRESENCE;
  protected readonly Tab = Tab;


  constructor(
    private route : ActivatedRoute,
    private navigationService: NavigationService,
    private translate : TranslateService,
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    protected alertService : AlertService
  ) {
    this.associationID = route.snapshot.params['associationID'];

    navigationService.showNavigation();
    this.translate.get('associationPresence.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLService.getAssociationName(this.associationID).then(r =>{
      navigationService.setSubTitle(r.name);
    })

    this.graphQLService.getAssociationPresences(this.associationID, 20, this.dataSourcePresences.endCursor)
      .then(r => {
        if(r === null) {
          console.error("Could not load Association presences.")
          return;
        }
        this.dataSourcePresences.hasMoreRows = r.presences.pageInfo.hasNextPage;
        this.dataSourcePresences.endCursor = r.presences.pageInfo.endCursor;
        this.dataSourcePresences.isDataLoading = false
        this.dataSourcePresences.dataRows.next(r.presences.edges.map((edge: any) => edge.node));
      })
  }

  ngOnInit(): void {
    this.dataSourcePresences.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.memberHeader,
        rowCell: this.memberRow,
        getRawValueToSort: (dataRow: UserPresence) => {
          return dataRow.user.fullName;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.dateHeader,
        rowCell: this.dateRow,
        getRawValueToSort: (dataRow: UserPresence) => {
          return dataRow.date;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.approvedUserHeader,
        rowCell: this.approvedUserRow,
        getRawValueToSort: (dataRow: UserPresence) => {
          return dataRow.approvedBy.fullName;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.actionsRow,
      },
    ]
    }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(barCode: string) {
    this.result = barCode
    this.search(this.result)
  }

  onHasPermission(permissionsEnabled: boolean) {
    this.hasPermission = permissionsEnabled;
  }

  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices?.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  async requestPermission() {
    try {
      // Vraag opnieuw toestemming
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.hasPermission = true;
      stream.getTracks().forEach(track => track.stop()); // Stop de camera na controle
    } catch (err) {
      console.error('Camera-toegang is nog steeds geweigerd:', err);
      // alert('Camera-toegang is vereist. Controleer de instellingen van je browser om dit te wijzigen.');
    }
  }

  search(searchValue?: string) {
    if(!searchValue) {
      searchValue = this.result
    }
    console.log(this.result)
    this.graphQLService.getAssociationMembers(this.associationID, 20, undefined, searchValue).then(r =>{
      console.log(r)
      this.resultList = r.users.edges.map((edge: any) => edge.node);
    })
  }

  protected readonly Modal = Modal;
  dataSourcePresences: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : UserPresence, searchValue : string) => {
      return dataRow.user.fullName.toLowerCase().includes(searchValue) || dataRow.approvedBy.fullName.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: UserPresence) => {
      return dataRow.id;
    },
    loadAdditionalRows: async () => {
      return this.graphQLService.getAssociationPresences(this.associationID, 20, this.dataSourcePresences.endCursor)
        .then(r => {
          this.dataSourcePresences.hasMoreRows = r.presences.pageInfo.hasNextPage;
          this.dataSourcePresences.endCursor = r.presences.pageInfo.endCursor;
          return r.presences.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    searchForAdditionalItems: async (search : string) => {
      return this.graphQLService.getAssociationPresences(this.associationID, 20, this.dataSourcePresences.searchEndCursor, search)
        .then(r => {
          this.dataSourcePresences.searchHasMoreRows = r.presences.pageInfo.hasNextPage;
          this.dataSourcePresences.searchEndCursor = r.presences.pageInfo.endCursor;
          return r.presences.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };

  createPresence(time: string) {
    if(this.currentSelected == null) {
      return
    }
    this.modalService.hideModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION)
    this.graphQLService.createUserPresence(this.associationID, this.currentSelected.user.id, time).then(r => {
      console.log(r)
    })
    console.log(time)
  }

  openConfirm(ua: UserAssociation) {
    this.currentSelected = ua
    this.modalService.showModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION)
  }

  protected formatDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    return this.translate.get("config.language").pipe(
      map(locale => {
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      })
    );
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly faTrashCan = faTrashCan;
  protected selectedPresence? : UserPresence
  protected confirmationMessage : string = ""

  onStartDelete(presence: UserPresence) {
    this.selectedPresence = presence;
    this.generateConfirmationMessage()
    this.modalService.showModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION_DELETE)
  }

  deletePresence() {
    if(this.selectedPresence) {
      this.modalService.hideModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION_DELETE)
      this.graphQLService.deleteUserPresence(this.associationID, this.selectedPresence.id).then((r: DefaultBooleanResponseDTO)=> {
        if(r.success) {
          this.dataSourcePresences.dataRows.next(this.dataSourcePresences.dataRows.getValue().filter(row => row.id !== this.selectedPresence!.id));
          this.selectedPresence = undefined;
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
      })
    }

  }

  async generateConfirmationMessage() {
    if (this.selectedPresence) {
      try {
        const formattedDate = await firstValueFrom(this.formatDate(this.selectedPresence.date));
        this.confirmationMessage = `Weet je zeker dat je de presentie van ${this.selectedPresence.user?.fullName} op ${formattedDate} wilt verwijderen?`;
      } catch (error) {
        console.error('Error formatting date:', error);
        this.confirmationMessage = "Er is een fout opgetreden bij het formatteren van de datum.";
      }
    } else {
      this.confirmationMessage = "";
    }
  }
}
