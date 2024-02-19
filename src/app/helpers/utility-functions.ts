import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";

/**
 * UtilityFunctions class provides utility functions for formatting dates and times.
 *
 * @remarks
 *
 * This class is injectable and should be provided in the root module.
 */
@Injectable({
  providedIn: 'root',
})
export class UtilityFunctions {
  constructor(
    private translate: TranslateService
  ) {
  }

  /**
   * Formats the given hour and minute into a string representation of time.
   *
   * @param {number} hour - The hour value (0-23).
   * @param {number} minute - The minute value (0-59).
   *
   * @return {string} - The formatted time as a string.
   */
  formatTimeI(hour: number, minute: number) {
    return this.formatTime(new Date(2024, 10, 10, hour, minute))
  }

  /**
   * Formats the given date object into a string representation of time,
   * based on the provided locale.
   *
   * @param {Date | undefined} date - The date object to format. Pass undefined to get an empty string.
   *
   * @return {Promise<string>} - A promise that resolves to a string representing the formatted time.
   */
  formatTime(date: Date | undefined) {

    if (date == null) {
      return new Promise<string>((resolve) => resolve(""));
    }
    return new Promise<string>((resolve) => {
      this.translate.get("config.language").subscribe({
        next: (locale) => {
          let options: Intl.DateTimeFormatOptions;

          // Als de locale 'nl-NL' is, gebruik dan het 24-uurs formaat
          if (locale === 'nl-NL') {
            options = {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false // Gebruik 24-uurs formaat voor Nederlandse tijd
            };
          } else {
            // Voor andere locales, gebruik het 12-uurs formaat met AM/PM
            options = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            };
          }

          // Formatteer de tijd volgens de lokale instellingen en de opgegeven opties
          resolve(Intl.DateTimeFormat(locale, options).format(date));
        }
      })
    });
  }

  /**
   * Formats a given Date object into a string representation based on the current locale.
   *
   * @param {Date} date - The Date object to be formatted.
   * @returns {Promise<string>} A promise that resolves to the formatted date string.
   */
  formatDate(date: Date) {
    return new Promise<string>((resolve) => {
      this.translate.get("config.language").subscribe({
        next: (locale) => {
          const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          };

          resolve(Intl.DateTimeFormat(locale, options).format(date));
        }
      })
    })
  }

  /**
   * Formats a Date object into a string suitable for a form control.
   *
   * @param {Date} date - The date to be formatted.
   * @returns {string} - The formatted date string in the 'yyyy-MM-dd' format.
   */
  formatDateForFormControl(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  /**
   * Formats a given date into a localized string representation.
   *
   * @param {Date} date - The date to be formatted.
   *
   * @return {Promise<string>} - A Promise that resolves to the formatted date string.
   */
  formatDateTime(date: Date | undefined) {
    return new Promise<string>((resolve) => {
      if(date == null) {
        resolve(" ");
        return;
      }
      this.translate.get("config.language").subscribe({
        next: (locale) => {
          let options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
          };
          if (locale === 'nl-NL') {
            options = {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              day: 'numeric',
              month: 'long',
            };
          } else {
            // Voor andere locales, gebruik het 12-uurs formaat met AM/PM
            options = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              day: 'numeric',
              month: 'long',
            };
          }

          resolve(Intl.DateTimeFormat(locale, options).format(date));
        }
      })
    })
  }

  /**
   * Converts a Date object to an ISO 8601 formatted string in local timezone.
   *
   * @param {Date} date - The Date object to convert.
   * @return {string} - The ISO 8601 formatted string in local timezone.
   */
  toLocalIsoDateTime(date: Date): string {
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num: number) => {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };

    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds());
  }

  formatDateTimeAsString(startDate: string | undefined): Promise<string> {
    if(startDate != null) {
      return this.formatDateTime(new Date(startDate))
    } else {
      return this.formatDateTime(undefined);
    }
  }
}

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}
