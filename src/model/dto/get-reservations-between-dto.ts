import {UserAssociation} from "../user-association.model";
import {WeaponMaintenance} from "../weapon-maintenance.model";
import {Reservation} from "../reservation.model";

export interface GetWeaponMaintenancesDTO {
  success: boolean;
  reservations: Reservation[];
}
