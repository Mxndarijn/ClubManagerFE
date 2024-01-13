import {Image} from "./image.model";
import {UserAssociation} from "./user-association.model";

export interface Association {
  id: string; // ID! in GraphQL wordt een string in TypeScript
  name: string; // String! in GraphQL wordt een string in TypeScript
  image?: Image; // Image in GraphQL is optioneel, dus het wordt ook optioneel in TypeScript
  welcomeMessage?: string; // String in GraphQL is optioneel, dus het wordt ook optioneel in TypeScript
  contactEmail?: string; // String in GraphQL is optioneel, dus het wordt ook optioneel in TypeScript
  active: boolean; // Boolean! in GraphQL wordt een boolean in TypeScript
  users?: UserAssociation[]; // [UserAssociation] in GraphQL is een array van UserAssociation in TypeScript
}
