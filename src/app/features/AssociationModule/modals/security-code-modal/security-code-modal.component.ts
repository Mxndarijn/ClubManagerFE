import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {
  DefaultInputFieldComponent, InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {
  ErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/error-message/error-message.component";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgSwitchCase} from "@angular/common";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {TranslateModule} from "@ngx-translate/core";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";

@Component({
  selector: 'app-security-code-modal',
  standalone: true,
  imports: [
    CustomButton,
    DefaultInputFieldComponent,
    ErrorMessageComponent,
    FormsModule,
    NgForOf,
    NgSwitchCase,
    ReactiveFormsModule,
    SingleErrorMessageComponent,
    TranslateModule,
    NgClass
  ],
  templateUrl: './security-code-modal.component.html',
  styleUrl: './security-code-modal.component.css'
})
export class SecurityCodeModalComponent extends DefaultModalInformation  {

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  codeFormControl: FormControl<string | null>;

  @Input() securityModalTitle: string = "";
  @Output() AcceptEvent = new EventEmitter<null>
  @Output() RejectEvent = new EventEmitter<null>

  constructor(
    modalService: ModalService,
  ) {
    super(Modal.SECURITY_CODE, modalService);
    this.codeFormControl = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)]));

  }

  filterValue() {
    if(!this.codeFormControl || !this.codeFormControl.value) {
      return ""
    }
    return this.codeFormControl.value.replace(/\D/g, "");
  }

  protected readonly InputFieldWidth = InputFieldWidth;

  acceptFunction() {
    this.AcceptEvent.emit();
  }

  cancelFunction() {
    this.RejectEvent.emit();
  }
}
