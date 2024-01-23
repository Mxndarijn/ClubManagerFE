import {Component, Input} from '@angular/core';
import {CalenderEvent} from "../calender-view/calender-view.component";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-calender-week',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './calender-week.component.html',
  styleUrls: ['./calender-week.component.css']
})

export class CalenderWeekComponent {
  @Input()  events: CalenderEvent[] = []
  private locale: string = "en-EN"
  protected hours: HourRow[] = []
  protected days: string[] = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"]

  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.get("config.language").subscribe({
      next: (response) => {
        this.locale = response;
        for(let i=7 ; i <= 23 ; i++)
        {
          this.hours.push({hourNumber: i, minuteNumber:0, displayName: this.formatTime(i, 0)});
          this.hours.push({hourNumber: i, minuteNumber:30, displayName: this.formatTime(i, 30)});
        }
      }
    })
  }

  protected readonly Math = Math;

    formatTime(hour: number, minute: number): string {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    let options: Intl.DateTimeFormatOptions;

    // Als de locale 'nl-NL' is, gebruik dan het 24-uurs formaat
    if (this.locale === 'nl-NL') {
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
    return new Intl.DateTimeFormat(this.locale, options).format(date);
  }
}

export interface HourRow {
  hourNumber: number,
  minuteNumber: number,
  displayName: string
}
