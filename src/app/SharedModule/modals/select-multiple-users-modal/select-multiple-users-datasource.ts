import {UserAssociation} from "../../../CoreModule/models/user-association.model";


export interface SelectMultipleUsersDatasource {
  searchUsers: (search: string) => Promise<UserAssociation[]>;
  loadUsers: () => Promise<UserAssociation[]>;
  first: number;
  endCursor?: any

  hasMoreRows: boolean;

  searchHasMoreRows?: boolean;
  searchEndCursor?: string;
  onSelect: (users: UserAssociation[]) => void;

  defaultSort?: (a: any, b: any) => number;
}
