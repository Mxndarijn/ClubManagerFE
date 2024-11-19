import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../../../CoreModule/services/modal.service";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject} from "rxjs";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {AssociationGuest} from "../../../../CoreModule/models/dto/association-guest-response-dto";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {
  CreateGuestModalComponent
} from "../../../AssociationModule/modals/create-guest-modal/create-guest-modal.component";

@Component({
  selector: 'app-my-guests-page',
  standalone: true,
  imports: [
    MultiColumnList,
    CreateGuestModalComponent
  ],
  templateUrl: './my-guests-page.component.html',
  styleUrl: './my-guests-page.component.css'
})
export class MyGuestsPageComponent implements OnInit {

  @ViewChild('GuestNameHeader', { static: true }) guestNameHeader!: TemplateRef<any>;
  @ViewChild('AssociationHeader', {static: true}) associationHeader!: TemplateRef<any>;
  @ViewChild('StatusHeader', {static: true}) statusHeader!: TemplateRef<any>;
  @ViewChild('ActionsHeader', {static: true}) actionsHeader!: TemplateRef<any>;
  @ViewChild('RequestDateHeader', {static: true}) requestDateHeader!: TemplateRef<any>;
  @ViewChild('DateHeader', {static: true}) dateHeader!: TemplateRef<any>;

  @ViewChild('GuestNameRow', { static: true }) guestNameRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('AssociationRow', {static: true}) associationRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('StatusRow', {static: true}) statusRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('ActionsRow', {static: true}) actionsRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('DateRow', {static: true}) dateRow!: TemplateRef<{ data: AssociationGuest }>;
  @ViewChild('RequestDateRow', {static: true}) requestDateRow!: TemplateRef<{ data: AssociationGuest }>;

  constructor(
    private alertService: AlertService,
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    route: ActivatedRoute,
    protected modalService: ModalService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {

    navigationService.setSubTitle("");

    navigationService.showNavigation();
    this.translate.get('my-guests.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.endCursor)
      .then(r => {
        console.log(r)
        this.dataSourceGuests.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
        this.dataSourceGuests.endCursor = r.associationGuests.pageInfo.endCursor;
        this.dataSourceGuests.isDataLoading = false
        this.dataSourceGuests.dataRows.next(r.associationGuests.edges.map((edge: any) => edge.node));
      })
      .catch(error => {
        console.error(error);
        return null;
      });

  }

  ngOnInit(): void {
    this.dataSourceGuests.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.guestNameHeader,
        rowCell: this.guestNameRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.guestFullName;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.dateHeader,
        rowCell: this.dateRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.eventTime;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.associationHeader,
        rowCell: this.associationRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.association.name;
        }
      },
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.statusHeader,
        rowCell: this.statusRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.status;
        }
      },
      {
        sortType: ColumnSortType.DATE,
        headerCell: this.requestDateHeader,
        rowCell: this.requestDateRow,
        getRawValueToSort: (dataRow: AssociationGuest) => {
          return dataRow.requestTime;
        }
      },
      {
        sortType: ColumnSortType.NONE,
        headerCell: this.actionsHeader,
        rowCell: this.actionsRow,
      },
    ]
  }

  /*
  * Introducee Naam
  * Vereniging
  * Status
  * Actions
  * */


  dataSourceGuests: MultiColumnListDataSource = {
    columns: [],
    dataRows: new BehaviorSubject<any[]>([]),
    hasMoreRows: true,
    initialRowCount: 0,
    isDataLoading: true,
    canSearch: true,
    emptyMessage: "LEEG",
    searchPlaceholder: "zoek",
    isInSearch: (dataRow : AssociationGuest, searchValue : string) => {
      return dataRow.guestFullName.toLowerCase().includes(searchValue) || dataRow.guestResidence.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: UserPresence) => {
      return dataRow.id;
    },
    loadAdditionalRows: async () => {
      return this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.endCursor)
        .then(r => {
          this.dataSourceGuests.hasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuests.endCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
    searchForAdditionalItems: async (search : string) => {
      return this.graphQLCommunication.getMyAssociationGuests(20, this.dataSourceGuests.searchEndCursor, search)
        .then(r => {
          this.dataSourceGuests.searchHasMoreRows = r.associationGuests.pageInfo.hasNextPage;
          this.dataSourceGuests.searchEndCursor = r.associationGuests.pageInfo.endCursor;
          return r.associationGuests.edges.map((edge: any) => edge.node);
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    },
  };


}
