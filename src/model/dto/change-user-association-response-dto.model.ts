import {UserAssociation} from "../user-association.model";

export interface ChangeUserAssociationResponseDTO {
  success: boolean;
  message: string;
  userAssociation: UserAssociation;
}
