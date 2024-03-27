import {UserAssociation} from "../user-association.model";
import {Weapon} from "../weapon.model";

export interface CreateWeaponResponseDTO {
  success: boolean;
  message: string;
  weapon: Weapon;
}
