import { WeaponType } from "./weapon-type.model";
import {Track} from "./track.model";
import { User } from "./user.model";
import { Association } from "./association.model";
import {DAYS_OF_WEEK} from "angular-calendar";

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
     reservationSerie?: ReservationSeries
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
     repeatDays: DAYS_OF_WEEK[]
}

export enum ReservationRepeat {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY"
}

export const ReservationRepeatLabels = {
  [ReservationRepeat.DAILY.valueOf()]: { label: "config.settings.repeat.daily", value: 1 },
  [ReservationRepeat.WEEKLY.valueOf()]: { label: "config.settings.repeat.weekly", value: 7 }
};