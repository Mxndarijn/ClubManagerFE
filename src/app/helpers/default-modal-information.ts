import {Modal, ModalChange, ModalService, ModalStatus} from "../services/modal.service";
import {GraphQLCommunication} from "../services/graphql-communication.service";
import {AlertService} from "../services/alert.service";
import {EventEmitter} from "@angular/core";

export class DefaultModalInformation {
  title: string = "";
  showModal: boolean = false;
  modal: Modal;
  public OnModalShowEvent = new EventEmitter<void>();


  constructor(
    modal: Modal,
    modalService: ModalService) {
    this.modal = modal;
    modalService.modalVisibilityEvent.subscribe({
      next: (modalChange : ModalChange) => {
        if (modalChange.modal === this.modal) {
          this.showModal = modalChange.status === ModalStatus.OPEN;
          if(modalChange.status === ModalStatus.OPEN)
            this.OnModalShowEvent.emit();
        }
      }
    })
  }


  public hideModal() {
    this.showModal = false;
  }
}
