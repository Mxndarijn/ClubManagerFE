import {UserAssociation} from "../user-association.model";
import {WeaponMaintenance} from "../weapon-maintenance.model";
import {Reservation, ReservationSeries} from "../reservation.model";

export interface CreateTrackReservationDTO {
  success: boolean;
  message?: string;
  reservationSeries?: ReservationSeries;
  reservations: Reservation[];
}
