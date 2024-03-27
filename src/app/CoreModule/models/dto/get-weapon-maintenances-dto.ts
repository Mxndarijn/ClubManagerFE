import {UserAssociation} from "../user-association.model";
import {WeaponMaintenance} from "../weapon-maintenance.model";

export interface GetWeaponMaintenancesDTO {
  success: boolean;
  maintenances: WeaponMaintenance[];
}
