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

export function splitAssociationRoles(roles : AssociationRole[]) {

  const FIRST_GROUP_ROLES = ['ADMIN', 'USER', 'VISITOR'];

  const groupedRoles = roles.reduce<{ primary: AssociationRole[], secondary: AssociationRole[] }>(
    (acc, role) => {
      if (FIRST_GROUP_ROLES.includes(role.name.toUpperCase())) {
        acc.primary.push(role);
      } else {
        acc.secondary.push(role);
      }
      return acc;
    },
    {primary: [], secondary: []}
  );

  return groupedRoles;
}
