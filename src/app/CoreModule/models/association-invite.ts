import {User} from "./user.model";
import {Association} from "./association.model";
import {AssociationRole} from "./association-role.model";

export interface AssociationInvite {
  id: string;
  email: String
  association: Association
  associationRole: AssociationRole;
  createdAt: string;
}
