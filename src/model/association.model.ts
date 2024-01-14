import {Image} from "./image.model";
import {UserAssociation} from "./user-association.model";

export interface Association {
  id: string;
  name: string;
  image?: Image;
  welcomeMessage?: string;
  contactEmail?: string;
  active: boolean;
  users?: UserAssociation[];
}
