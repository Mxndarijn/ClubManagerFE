import {Modal, ModalChange, ModalService, ModalStatus} from "../../CoreModule/services/modal.service";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../CoreModule/services/alert.service";
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
