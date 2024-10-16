import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup,} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-error-message-manual',
  templateUrl: './error-message-manual.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./error-message-manual.component.css']
})
export class ErrorMessageManualComponent {
  @Input() visible = false;
  @Input() errorMessage = "error";




  shouldShowError() : boolean  {
    return this.visible;
  }

  public showErrorMessage(message: string) {
    this.errorMessage = message;
    this.visible = true;
  }

  public hideErrorMessage() {
    this.visible = false;
  }
}
