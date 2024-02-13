import {UserAssociation} from "../user-association.model";

export interface DefaultBooleanResponseDTO {
  success: boolean;
  message: string;
}


export interface DefaultBooleanResponseWithAnyMessageDTO {
  success: boolean;
  message: any;
}
