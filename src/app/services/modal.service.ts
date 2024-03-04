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
    ASSOCIATION_WEAPONS_CREATE_EDIT_WEAPON_MAINTENANCE,
    ASSOCIATION_CONFIGURE_TRACK_CREATE_TRACK,
    ASSOCIATION_CONFIGURE_TRACK_CONFIRM_DELETE,
    ASSOCIATION_CONFIGURE_TRACK_CREATE_RESERVATION,
    ASSOCIATION_CONFIGURE_TRACK_VIEW_RESERVATION,
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
