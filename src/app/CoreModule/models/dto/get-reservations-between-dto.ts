import {Reservation} from "../reservation.model";

export interface GetReservationsDTO {
  success: boolean;
  reservations: Reservation[];
}
