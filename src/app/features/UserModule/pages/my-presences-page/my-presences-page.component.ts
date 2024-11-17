import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {AsyncPipe, NgIf} from "@angular/common";
import {
  ColumnSortType,
  MultiColumnListDataSource
} from "../../../../SharedModule/components/multi-column-list/multi-column-list-datasource";
import {BehaviorSubject, map, Observable} from "rxjs";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../../../CoreModule/services/modal.service";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";
import {MultiColumnList} from "../../../../SharedModule/components/multi-column-list/multi-column-list";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";

enum Tab {
  PRESENCES,
  INTRODUCES
}

@Component({
  selector: 'app-my-presences-page',
  standalone: true,
  imports: [
    TabComponent,
    NgIf,
    MultiColumnList,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './my-presences-page.component.html',
  styleUrl: './my-presences-page.component.css'
})
export class MyPresencesPageComponent implements OnInit {
  activeTab: Tab = Tab.PRESENCES;
  protected readonly Tab = Tab;
  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Presentie",
        onClick : () => {
          this.activeTab = Tab.PRESENCES
        }
      },
      {
        label: "Introducees",
        onClick : () => {
          this.activeTab = Tab.INTRODUCES
        }
      }
    ]
  };

  @ViewChild('AssociationHeader', { static: true }) associationHeader!: TemplateRef<any>;
  @ViewChild('DateHeader', {static: true}) dateHeader!: TemplateRef<any>;
  @ViewChild('ApprovedUserHeader', {static: true}) approvedUserHeader!: TemplateRef<any>;

  @ViewChild('AssociationRow', { static: true }) associationRow!: TemplateRef<{ data: UserPresence }>;
  @ViewChild('DateRow', {static: true}) dateRow!: TemplateRef<{ data: UserPresence }>;
  @ViewChild('ApprovedUserRow', {static: true}) approvedUserRow!: TemplateRef<{ data: UserPresence }>;



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
    this.translate.get('my-presences.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLCommunication.getUserPresences(20, this.dataSourcePresences.endCursor)
      .then(r => {
        console.log(r)
        this.dataSourcePresences.hasMoreRows = r.presences.pageInfo.hasNextPage;
        this.dataSourcePresences.endCursor = r.presences.pageInfo.endCursor;
        this.dataSourcePresences.isDataLoading = false
        this.dataSourcePresences.dataRows.next(r.presences.edges.map((edge: any) => edge.node));
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  ngOnInit(): void {

    this.dataSourcePresences.columns= [
      {
        sortType: ColumnSortType.ALPHABETICAL,
        headerCell: this.associationHeader,
        rowCell: this.associationRow,
        getRawValueToSort: (dataRow: UserPresence) => {
          return dataRow.association.name;
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
    ]
    }

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
      return dataRow.association.name.toLowerCase().includes(searchValue);
    },
    getID: (dataRow: UserPresence) => {
      return dataRow.id;
    },
    loadAdditionalRows: async () => {
      return this.graphQLCommunication.getUserPresences(20, this.dataSourcePresences.endCursor)
        .then(r => {
          console.log(r)
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
      return this.graphQLCommunication.getUserPresences(20, this.dataSourcePresences.searchEndCursor, search)
        .then(r => {
          console.log(r)
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

}
