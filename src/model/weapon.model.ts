import {Association} from "./association.model";
import {WeaponType} from "./weapon-type.model";

export interface Weapon {
  id: string,
  name: string,
  type: WeaponType,
  status: string
}

export enum WeaponStatus {
  ACTIVE = "Actief",
  INACTIVE = "Inactief",
  MAINTENANCE = "Onderhoud"
}

export function getWeaponStatus(name : string) {
  return WeaponStatus[name as keyof typeof WeaponStatus]
}
