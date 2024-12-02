import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  InputFieldDurationComponent
} from "../../../../SharedModule/components/input-fields/input-field-duration/input-field-duration.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";

@Component({
  selector: 'app-association-presence-create',
  standalone: true,
  imports: [
    DateTimeSelectorComponent,
    DefaultInputFieldComponent,
    FormsModule,
    InputFieldDurationComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './association-presence-create.component.html',
  styleUrl: './association-presence-create.component.css'
})
export class AssociationPresenceCreateComponent extends DefaultModalInformation implements OnInit {

  dateTimeFormControl : FormGroup<{ date: FormControl<string | null> }>
  currentDay = new Date(new Date().setMinutes(new Date().getMinutes() - 1))
  @Output() onClickEvent = new EventEmitter()
  @Input() dataSource?: UserAssociation;


  constructor(modalService: ModalService,
              protected util: UtilityFunctions) {
    super(Modal.ASSOCIATION_PRESENCE_CONFIRMATION, modalService);
    this.dateTimeFormControl = new FormGroup({
      date: new FormControl(this.currentDay.toISOString().slice(0, 16), Validators.compose([Validators.required]))
    })
  }

  ngOnInit(): void {
    this.currentDay = new Date(new Date().setMinutes(new Date().getMinutes() - 1))
    this.dateTimeFormControl = new FormGroup({
      date: new FormControl(new Date().toISOString().slice(0, 16), Validators.compose([Validators.required]))
    })
    console.log(this.currentDay.toISOString())
    }


  onClick() {
    if(!this.dateTimeFormControl.valid)
      return
    this.onClickEvent.emit(this.dateTimeFormControl.controls.date.value!)

  }
}
