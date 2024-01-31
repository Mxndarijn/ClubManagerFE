import {TranslateService} from "@ngx-translate/core";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class UtilityFunctions {
  constructor(
    private translate: TranslateService
  ) {
  }

  formatTimeI(hour: number, minute: number) {
    return this.formatTime(new Date(2024, 10, 10, hour, minute))
  }

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

  formatDateForFormControl(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  formatDateTime(date: Date) {
    return new Promise<string>((resolve) => {
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
}
