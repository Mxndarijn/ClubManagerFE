import {Association} from "./association.model";
import {ColorPreset} from "./color-preset.model";

export interface WeaponMaintenance {
  id: string;
  association: Association;
  startDate: Date;
  endDate: Date;
  title: string;
  colorPreset: ColorPreset;
  description: string;

}
