import {Reservation} from "../reservation.model";

export interface GetWeaponMaintenancesDTO {
  success: boolean;
  reservations: Reservation[];
}
