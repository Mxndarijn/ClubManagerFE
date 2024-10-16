import {Reservation, ReservationSeries} from "../reservation.model";

export interface CreateTrackReservationDTO {
  success: boolean;
  message?: string;
  reservationSeries?: ReservationSeries;
  reservations: Reservation[];
}
