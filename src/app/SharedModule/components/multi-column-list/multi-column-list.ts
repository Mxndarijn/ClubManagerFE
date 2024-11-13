import {Component, Input, OnInit} from '@angular/core';
import {MultiColumnListDataSource} from "./multi-column-list-datasource";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {SearchBoxComponent} from "../input-fields/search-box/search-box.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-multi-column-list',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    TranslateModule
  ],
  templateUrl: './multi-column-list.html',
  styleUrl: './multi-column-list.css'
})
export class MultiColumnList implements OnInit{
  @Input() dataSource! : MultiColumnListDataSource;
  searchValue: string = ""
  filteredItems : any[] = []
  loadingMoreRows = false

  constructor() {
  }

  ngOnInit(): void {
    this.filteredItems = this.dataSource.dataRows.value
    this.dataSource.dataRows.subscribe(() => {
      this.search(this.searchValue, false)
    });
    }

  search(searchString: string, searchForItems = true) {
    if(this.dataSource.isInSearch == null || !this.dataSource.canSearch) {
      this.filteredItems = this.dataSource.dataRows.value;
      return
    }
    this.searchValue = searchString
    this.filteredItems = this.dataSource.dataRows.value.filter(item => this.dataSource.isInSearch!(item, searchString));

    if(searchForItems) {
      this.loadMoreRows()
    }

  }

  loadMoreRows() {
    if(this.dataSource.loadAdditionalRows == null || this.loadingMoreRows)
      return
    this.loadingMoreRows = true
    if(this.searchValue.length == 0 || this.dataSource.searchForAdditionalItems == null)
      this.dataSource.loadAdditionalRows().then(rows => this.processLoadedRows(rows))
    else
      this.dataSource.searchForAdditionalItems!(this.searchValue).then(rows => this.processLoadedRows(rows))
  }
  processLoadedRows(rows : any[]) {
    const list = [...new Map([...this.dataSource.dataRows.value, ...rows].map(item => [this.dataSource.getID(item), item])).values()];
    this.dataSource.dataRows.next(list);
    this.loadingMoreRows = false;
    this.search(this.searchValue, false);
  }
}
