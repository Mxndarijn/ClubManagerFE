import { WeaponType } from "./weapon-type.model";
import {Track} from "./track.model";
import { User } from "./user.model";
import { Association } from "./association.model";
import {DAYS_OF_WEEK} from "angular-calendar";

export interface Reservation {
     id: string;
     association: Association;
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

 }



enum ReservationStatus {
     IDK,
     // Add other enum values here
 }

export interface ReservationSeries {
     id: string;
     reservations: Reservation[];
     reservationRepeat: ReservationRepeat;
     repeatInteger: number;
     repeatDaysBetween: number;
     repeatUntil: string;
     repeatDays: DAYS_OF_WEEK[]
}

export enum ReservationRepeat {
  NO_REPEAT = "config.settings.repeat.no_repeat",
  DAY = "config.settings.repeat.day",
  WEEK = "config.settings.repeat.week",
  CUSTOM = "config.settings.repeat.custom"
}
