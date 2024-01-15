import {AssociationInvite} from "../association-invite";

export interface SendAssociationInviteResponseDTO {
  success: boolean;
  message: string;
  associationInvite?: AssociationInvite;

}
