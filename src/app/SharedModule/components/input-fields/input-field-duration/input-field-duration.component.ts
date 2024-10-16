import {FormControl, FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {Component, EventEmitter, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-input-field-duration',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    SingleErrorMessageComponent
  ],
  templateUrl: './input-field-duration.component.html',
  styleUrl: './input-field-duration.component.css'
})
export class InputFieldDurationComponent implements OnInit {
  minuteValue?: number;
  secondValue?: number;
  millisecondValue?: number;
  @Input() _formControl!: FormControl;
  @Input() OnFormReset?: EventEmitter<null>;

  ngOnInit(): void {
      this.OnFormReset?.subscribe({ next: () => {
          this.minuteValue = undefined
          this.secondValue = undefined
          this.millisecondValue = undefined
        }})
  }

  updateDuration() {
    this.minuteValue = this.checkValue(this.minuteValue, 59)
    this.secondValue = this.checkValue(this.secondValue, 59)
    this.millisecondValue = this.checkValue(this.millisecondValue, 999)

    console.log("m" + this.minuteValue,"s" +  this.secondValue, "mil" + this.millisecondValue);

    const minutesInMilliseconds = this.getValue(this.minuteValue) * 60 * 1000;
    const secondsInMilliseconds = this.getValue(this.secondValue) * 1000;
    const milliseconds = this.getValue(this.millisecondValue);

    const nanoseconds = (minutesInMilliseconds + secondsInMilliseconds + milliseconds) * 1_000_000;
    this._formControl.setValue(nanoseconds)

  }

  checkValue(value?: number, max = 59) {
    if (value == null || isNaN(value)) {
      return undefined;
    }

    if (value < 0) {
      return 0
    } else if (value > max) {
      return max
    }
    return value
  }


  getValue(value? : number) {
    if(value == null) {
      return 0
    }
    return value!
  }


}
