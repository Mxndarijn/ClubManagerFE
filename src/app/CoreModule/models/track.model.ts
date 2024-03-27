import {Association} from "./association.model";
import {WeaponType} from "./weapon-type.model";

export interface Track {
  id: string,
  name: string,
  description: string,
  allowedWeaponTypes: WeaponType[],
}

