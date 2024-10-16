import {Association} from "./association.model";
import {ColorPreset} from "./color-preset.model";
import {Weapon} from "./weapon.model";

export interface WeaponMaintenance {
  id?: string;
  association?: Association;
  startDate?: string;
  endDate?: string;
  title?: string;
  colorPreset?: ColorPreset;
  description?: string;
  weapon?: Weapon;

}

export function generateDefaultWeaponMaintenance() : WeaponMaintenance {
  return {
    title: "",
    description: "",
    startDate: '',
    endDate: ''
  } as WeaponMaintenance
}
