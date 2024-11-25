import {Component, EventEmitter, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {ErrorSetting} from "../default-input-field/default-input-field.component";
import {MultiSelectInputFieldDatasource} from "./multi-select-input-field-datasource";

@Component({
  selector: 'app-input-field-multi-select',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    SingleErrorMessageComponent,
  ],
  templateUrl: './multi-select-input-field.component.html',
  styleUrl: './multi-select-input-field.component.css'
})
export class MultiSelectInputFieldComponent implements OnInit {
  @Input() dataSource!: MultiSelectInputFieldDatasource;
  protected _id: string = "";
  processedItems: { original: any; processed: string }[] = [];

  async ngOnInit() {
    this.dataSource.formControl.reset();
    this._id = Math.random().toString(15);
    this.dataSource.items.subscribe({
      next: async (items: any[]) => {
        await this.loadItems();
      }
    });

    await this.loadItems();
  }

  async loadItems() {
    this.dataSource.formControl.reset();
    const newItems = await Promise.all(
      this.dataSource.items.value.map(async (item : any) => {
        const processed = await this.dataSource.processItem(item);
        return { original: item, processed };
      })
    );
    this.processedItems = [];
    this.processedItems = [...this.processedItems, ...newItems];
  }

  isItemSelected(item: any): boolean {
    return this.dataSource.formControl.value?.includes(item);
  }

  toggleItemSelection(item: any) {
    const currentSelection = this.dataSource.formControl.value || [];
    if (currentSelection.includes(item)) {
      this.dataSource.formControl.setValue(currentSelection.filter((i: any) => i !== item));
    } else {
      this.dataSource.formControl.setValue([...currentSelection, item]);
    }
  }

  getSelectedItemsDisplay(): string {
    const selectedItems = this.dataSource.formControl.value || [];
    return selectedItems.map((item : any) => {
      const found = this.processedItems.find(pi => pi.original === item);
      return found ? found.processed : item;
    }).join(', ');
  }
}
