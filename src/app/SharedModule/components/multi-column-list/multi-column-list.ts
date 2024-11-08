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

  constructor() {
  }

  ngOnInit(): void {
    this.filteredItems = this.dataSource.dataRows.value
    this.dataSource.dataRows.subscribe(() => {
      this.search(this.searchValue)
    });
    }

  search(searchString: string) {
    if(this.dataSource.isInSearch == null) {
      this.filteredItems = this.dataSource.dataRows.value;
      return
    }
    this.searchValue = searchString
    this.filteredItems = this.dataSource.dataRows.value.filter(item => this.dataSource.isInSearch!(item, searchString));

  }
}
