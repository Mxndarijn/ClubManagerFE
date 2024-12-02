import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../CoreModule/services/modal.service";
import {ButtonClass, ButtonSize, CustomButton} from "../../components/buttons/custom-button/custom-button";

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    CustomButton
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  @Input() header: string = "";
  @Input() message: string = "";
  @Input() rejectButtonText: string = "";
  @Input() acceptButtonText: string = "";
  @Input() modalTag: Modal = Modal.CONFIRMATION;

  @Output() AcceptEvent = new EventEmitter<null>
  @Output() RejectEvent = new EventEmitter<null>

  showModal: boolean = false;

  constructor(
    private modalService: ModalService
  ) {
    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if (modalChange.modal == this.modalTag)
          this.showModal = (modalChange.status === ModalStatus.OPEN);
      }
    })
  }

  acceptFunction() {
    this.AcceptEvent.emit();
  }

  cancelFunction() {
    this.RejectEvent.emit();
  }

  protected readonly ButtonSize = ButtonSize;
  protected readonly ButtonClass = ButtonClass;
}
