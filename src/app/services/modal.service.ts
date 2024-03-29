import {EventEmitter, Injectable} from '@angular/core';


export enum Modal {
  ASSOCIATION_MEMBERS_MODIFY_MEMBER,
  ASSOCIATION_MEMBERS_REMOVE_MEMBER,
  ASSOCIATION_MEMBERS_CREATE_INVITE,
  CONFIRMATION,
  INVITATIONS_ACCEPT_ASSOCIATION_INVITE,
  INVITATIONS_DECLINE_ASSOCIATION_INVITE,
  ASSOCIATION_WEAPONS_CREATE_WEAPON,
  ASSOCIATION_WEAPON_INFORMATION,
  ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE
}

export enum ModalStatus {
  OPEN,
  CLOSE
}


export interface ModalChange {
  modal: Modal,
  status: ModalStatus
}


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public readonly modalVisibilityEvent: EventEmitter<ModalChange> = new EventEmitter();

  public showModal(modal: Modal) {
    const modalChange: ModalChange = {
      modal: modal,
      status: ModalStatus.OPEN
    };

    this.modalVisibilityEvent.emit(modalChange);
  }

  public hideModal(modal: Modal) {
    const modalChange: ModalChange = {
      modal: modal,
      status: ModalStatus.CLOSE
    };

    this.modalVisibilityEvent.emit(modalChange);
  }

}
