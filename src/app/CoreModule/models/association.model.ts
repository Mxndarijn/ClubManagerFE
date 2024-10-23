import {Image} from "./image.model";
import {UserAssociation} from "./user-association.model";
import {Reservation} from "./reservation.model";

export interface Association {
  id: string;
  name: string;
  image?: Image;
  welcomeMessage?: string;
  contactEmail?: string;
  active: boolean;
  users?: UserAssociation[];
  reservations?: Reservation[];
}
