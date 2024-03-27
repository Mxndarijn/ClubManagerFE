import {User} from "./user.model";
import {Association} from "./association.model";
import {AssociationRole} from "./association-role.model";

export interface AssociationInvite {
  id: AssociationInviteID;
  user: User;
  association: Association
  associationRole: AssociationRole;
  createdAt: string;
}

export interface AssociationInviteID {
  userId: string,
  associationId: string
}
