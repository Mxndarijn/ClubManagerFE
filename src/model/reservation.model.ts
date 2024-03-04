import {WeaponType} from "./weapon-type.model";
import {Track} from "./track.model";
import {User} from "./user.model";
import {Association} from "./association.model";
import {DAYS_OF_WEEK} from "angular-calendar";
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
