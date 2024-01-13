import {User} from "./user.model";

export interface AccountPermission {
  id: string; // ID! in GraphQL wordt een string in TypeScript
  name: string; // String! in GraphQL wordt een string in TypeScript
  description?: string; // String in GraphQL is optioneel, dus het wordt ook optioneel in TypeScript
  roles: AccountRole[]; // [AccountRole] in GraphQL is een array van AccountRole in TypeScript
}

export interface AccountRole {
  id: string; // ID! in GraphQL wordt een string in TypeScript
  name: string; // String! in GraphQL wordt een string in TypeScript
  users: User[]; // [User] in GraphQL is een array van User in TypeScript
  permissions?: AccountPermission[]; // [AccountPermission] in GraphQL is een array van AccountPermission in TypeScript
}
