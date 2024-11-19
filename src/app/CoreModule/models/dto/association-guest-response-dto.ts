import {User} from "../user.model";
import {Association} from "../association.model";

export interface AssociationGuestResponseDTO {
  success: boolean;
  message: string;
  associationGuest: AssociationGuest;
}


export interface AssociationGuest {
  id: string;
  requester: User;
  reviewer: User;
  association: Association;
  status: AssociationGuestStatus;
  guestFullName: string;
  requestTime: string; // LocalDateTime
  eventTime: string; // LocalDateTime
  guestResidence: string;
  guestVerificationType?: AssociationGuestVerificationType;
  guestVerificationCode?: string;
}


export enum AssociationGuestStatus {
  PENDING,
  APPROVED,
  DENIED
}


export enum AssociationGuestVerificationType {
  ID,
  DRIVER_LICENSE,
  PASSPORT,
}
