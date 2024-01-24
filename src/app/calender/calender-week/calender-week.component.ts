import {Component, Input} from '@angular/core';
import {CalenderEvent} from "../calender-view/calender-view.component";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {addDays, addHours, differenceInMinutes} from "date-fns";
import {GridTableCellComponent} from "../../table/grid-table-cell/grid-table-cell.component";

@Component({
  selector: 'app-calender-week',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle,
    GridTableCellComponent
  ],
  templateUrl: './calender-week.component.html',
  styleUrls: ['./calender-week.component.css']
})

export class CalenderWeekComponent {
  @Input() events: CalenderEvent[] = [{
    startDate: new Date(2024, 0, 24, 16, 0),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: "#a40b0b",
    data: {},

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  }, {
    startDate: new Date(),
    endDate: addHours(new Date(), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: "#0b3ba4",
    data: {},

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  }]
  private locale: string = "en-EN"
  protected hours: HourRow[] = []
  protected days: string[] = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"]
  private weekStartDay = new Date(2024, 0, 22)
  private cellHeight = 3.5
  private cellTime = 30.0


  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.get("config.language").subscribe({
      next: (response) => {
        this.locale = response;
        for (let i = 7; i <= 23; i++) {
          this.hours.push({hourNumber: i, minuteNumber: 0, displayName: this.formatTime(i, 0)});
          this.hours.push({hourNumber: i, minuteNumber: 30, displayName: this.formatTime(i, 30)});
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

  areDatesEqualWithoutTime(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  getEventsForDate(dayIndex: number, hourIndex: HourRow) {
    const currentDate = addDays(this.weekStartDay, dayIndex);
    return this.events.filter(event => {
      return this.areDatesEqualWithoutTime(currentDate, event.startDate) && event.startDate.getHours() === hourIndex.hourNumber && event.startDate.getMinutes() >= (hourIndex.minuteNumber) && event.startDate.getMinutes() < (hourIndex.minuteNumber + 30)
    })
  }

  calculateWidth(eventCount: number): string {
    const maxWidthForSingleEvent = 100;

    const calculatedWidth = eventCount > 1 ? 100 / eventCount : maxWidthForSingleEvent;

    return calculatedWidth + '%';
  }

  calculateLeft(length: number, eventIndex: number) {
    return ((100 / length) * eventIndex) + '%'

  }

  calculateHeight(event: CalenderEvent) {
    const minutes = Math.abs(differenceInMinutes(event.startDate, event.endDate))
    console.log(minutes)
    return (minutes / this.cellTime) * this.cellHeight + 'rem';
  }

  calculateTop(event: CalenderEvent) {
    return (event.startDate.getMinutes() / this.cellTime) * this.cellHeight + 'rem';
  }
}

export interface HourRow {
  hourNumber: number,
  minuteNumber: number,
  displayName: string
}


