import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {ErrorSetting} from "../default-input-field/default-input-field.component";

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
  @Input() _formControl!: FormControl;
  @Input() inputList: any[] = [];
  @Input() _label: string = "";
  @Input() processItem!: (input: any) => Promise<string>;
  @Input() hideErrorsWhenEmpty: boolean = false;
  @Input() errorSetting!: ErrorSetting;
  protected _id: string = "";
  processedItems: { original: any; processed: string }[] = [];

  async ngOnInit() {
    this._id = Math.random().toString(15);

    const newItems = await Promise.all(
      this.inputList.map(async item => {
        const processed = await this.processItem(item);
        return { original: item, processed };
      })
    );
    this.processedItems = [...this.processedItems, ...newItems];
  }
}



