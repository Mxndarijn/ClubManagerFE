import {FormControl} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {ErrorSetting} from "../default-input-field/default-input-field.component";

export interface MultiSelectInputFieldDatasource {
  formControl: FormControl;
  processItem: (input: any) => Promise<string>;
  items: BehaviorSubject<any[]>;
  errorSetting: ErrorSetting;
  hideErrorsWhenEmpty: boolean;
  label: string;
}
