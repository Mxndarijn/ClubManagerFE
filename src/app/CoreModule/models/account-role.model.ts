import {User} from "./user.model";

export interface AccountPermission {
  id: string;
  name: string;
  description?: string;
  roles: AccountRole[];
}

export interface AccountRole {
  id: string;
  name: string;
  users: User[];
  permissions?: AccountPermission[];
}
