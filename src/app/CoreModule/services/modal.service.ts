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
    ASSOCIATION_RESERVE_ENROLL_AT_RESERVATION,
    ASSOCIATION_CREATE_COMPETITION,
    ASSOCIATION_COMPETITION_MEMBERS_OVERVIEW,
    ASSOCIATION_COMPETITION_MEMBERS_ADD_USER_SCORE,
    ASSOCIATION_COMPETITION_MEMBERS_REMOVE_USER,
    MY_RESERVATIONS_VIEW_DETAIL,
    ASSOCIATION_MEMBERS_DELETE_INVITE,
    ASSOCIATION_PRESENCE_CONFIRMATION,
    ASSOCIATION_PRESENCE_CONFIRMATION_DELETE,
    GUEST_CREATE_GUEST,
    GUEST_CANCEL_GUEST,
    GUEST_CHANGE_GUEST,
  FORGOT_PASSWORD
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
    document.body.style.overflowY = 'hidden';
    const modalChange: ModalChange = {
      modal: modal,
      status: ModalStatus.OPEN
    };

    this.modalVisibilityEvent.emit(modalChange);
  }

  public hideModal(modal: Modal) {
    document.body.style.overflowY = 'scroll';
    const modalChange: ModalChange = {
      modal: modal,
      status: ModalStatus.CLOSE
    };

    this.modalVisibilityEvent.emit(modalChange);
  }

}
