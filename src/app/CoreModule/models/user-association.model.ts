import {User} from "./user.model";
import {Association} from "./association.model";
import {AssociationRole} from "./association-role.model";

export interface UserAssociation {
  id: UserAssociationId;
  user: User;
  association: Association;
  memberSince: string;
  associationRole: AssociationRole;
}

export interface UserAssociationId {
  userId: string;
  associationId: string;
}
