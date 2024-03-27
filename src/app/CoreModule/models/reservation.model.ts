import {WeaponType} from "./weapon-type.model";
import {Track} from "./track.model";
import {User} from "./user.model";
import {Association} from "./association.model";
import {ColorPreset} from "./color-preset.model";

export interface Reservation {
  id: string;
  association: Association | undefined;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  status: ReservationStatus;
  maxSize: number;
  users: User[];
  tracks: Track[];
  allowedWeaponTypes: WeaponType[];
  reservationSerie?: ReservationSeries;
  colorPreset?: ColorPreset;
}


export enum ReservationStatus {
  IDK,
  // Add other enum values here
}

export interface ReservationSeries {
  id: string;
  reservations: Reservation[];
  reservationRepeat: ReservationRepeat;
  repeatDaysBetween: number;
  repeatUntil: string;
}

export enum ReservationRepeat {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  NO_REPEAT = "NO_REPEAT"
}

export const ReservationRepeatLabels = {
  [ReservationRepeat.DAILY.valueOf()]: {label: "config.settings.repeat.daily", value: 1},
  [ReservationRepeat.WEEKLY.valueOf()]: {label: "config.settings.repeat.weekly", value: 7},
  [ReservationRepeat.NO_REPEAT.valueOf()]: {label: "config.settings.repeat.NO_REPEAT", value: 7},
};

export function convertReservationToCalendarEvent(reservation: Reservation) {
  const s = new Date();
  s.setSeconds(0,0);

  const e = new Date();
  e.setSeconds(0,0);
  return {
    title: reservation!.title!,
    description: reservation!.description!,
    id: reservation.id!,
    color: reservation.colorPreset!,
    data: reservation,
    width: 100,
    columnIndex: -1,
    startDate: reservation.startDate != null && reservation.startDate.length > 0 ? new Date(reservation!.startDate!) : s,
    endDate: reservation.endDate != null && reservation.endDate.length > 0 ? new Date(reservation!.endDate!) : e
  }
}
