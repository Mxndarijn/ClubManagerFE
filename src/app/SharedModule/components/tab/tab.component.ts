import {Component, Input, OnInit} from '@angular/core';
import {TabDataSource, TabItemDataSource} from "./tab-datasource";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent implements OnInit {
  @Input() dataSource!: TabDataSource;
  currentActive?: TabItemDataSource


  ngOnInit(): void {
    if (this.dataSource && this.dataSource.items.length > this.dataSource.defaultActive) {
      this.currentActive = this.dataSource.items[this.dataSource.defaultActive];
    } else {
      console.error("Unable to set the default active tab because the index is out of range or dataSource is invalid.");
    }
  }

  setActive(item: TabItemDataSource) {
    if(this.currentActive != null && this.currentActive !== item) {
      this.currentActive.onDeactivate?.();
      item.onClick?.();
      this.currentActive = item;
    }
  }
}

