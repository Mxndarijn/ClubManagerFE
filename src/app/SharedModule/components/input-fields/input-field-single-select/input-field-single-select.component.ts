import {Component, EventEmitter, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {ErrorSetting} from "../default-input-field/default-input-field.component";
import {InputFieldSingleSelectDataSource} from "./input-field-single-select-datasource";
import {data} from "autoprefixer";

@Component({
  selector: 'app-input-field-single-select',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    SingleErrorMessageComponent,
  ],
  templateUrl: './input-field-single-select.component.html',
  styleUrl: './input-field-single-select.component.css'
})
export class InputFieldSingleSelectComponent implements OnInit {
  @Input() dataSource!: InputFieldSingleSelectDataSource
  protected _id: string = "";
  processedItems: { original: any; processed: string }[] = [];



  async ngOnInit() {
    this.dataSource.formControl.reset()
    this._id = Math.random().toString(15);
    this.dataSource.items.subscribe({
      next : async (items : any[]) => {
        await this.loadItems()
      }
    })

    await this.loadItems()
  }

  async loadItems() {
    this.dataSource.formControl.reset()
    const newItems = await Promise.all(
      this.dataSource.items.value.map(async item => {
        const processed = await this.dataSource.processItem(item);
        return { original: item, processed };
      })
    );
    this.processedItems = []
    this.processedItems = [...this.processedItems, ...newItems];
    console.log(this.processedItems)
    if(this.processedItems.length == 1) {
      // this._formControl.setValue(this.processedItems[0].original)
    }
    }

  protected readonly data = data;
}



