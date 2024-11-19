import {WeaponType} from "./weapon-type.model";

export interface Weapon {
  id: string,
  name: string,
  type: WeaponType,
  status: string
}

export enum WeaponStatus {
  ACTIVE,
  INACTIVE,
  MAINTENANCE
}

export function getWeaponStatus(name : string) {
  return WeaponStatus[name as keyof typeof WeaponStatus]
}
