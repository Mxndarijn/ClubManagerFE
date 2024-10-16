export interface AssociationPermission {
  id: string;
  name: string;
  description: string;
  roles: AssociationRole[];
}

export interface AssociationRole {
  id: string;
  name: string;
  permissions: AssociationPermission[];
}
