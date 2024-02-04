import {UserAssociation} from "../user-association.model";
import {WeaponMaintenance} from "../weapon-maintenance.model";

export interface CreateWeaponMaintenanceResponseDTO {
  success: boolean;
  message: string;
  maintenance: WeaponMaintenance;
}
