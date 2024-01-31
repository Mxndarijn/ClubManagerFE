import {Component, Input, OnInit} from '@angular/core';
import { CalenderEvent } from '../calender-view/calender-view.component';
import {BehaviorSubject} from "rxjs";
import {addDays, subDays} from "date-fns";
import {CalendarEvent} from "angular-calendar";
import {NgClass, NgForOf, NgStyle} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgStyle
  ],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit {
  title: string = "Titel";
  @Input() focusDayChangedEvent!: BehaviorSubject<Date>
  @Input() eventsChangedEvent!: BehaviorSubject<CalenderEvent[]>
  @Input() currentDay!: Date
  @Input() monthItems: MonthItem[] = []
  private events: CalenderEvent[] = []
  private focusDay: Date = new Date(2024, 0, 24, 17, 10)
  protected days: string[] = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"]
  private startingRow = 3;
  protected endingRow = 7;
  protected startingColumn = 1

  constructor(
    private translate : TranslateService
  ) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.eventsChangedEvent.subscribe({
        next: (events: CalenderEvent[]) => {
          this.events = events
          this.refreshEvents();
        }
      })

      this.focusDayChangedEvent.subscribe({
        next: (date: Date) => {
          this.focusDay = date;
        }
      })
    });
  }

  private refreshEvents() {
    this.monthItems = []
    this.formatMonthName(this.focusDay).then(v => {
      this.title = v;
    })
    const days = new Date(this.focusDay.getFullYear(), this.focusDay.getMonth() + 1, 0). getDate();

    const endOfMonth = new Date(this.focusDay)
    endOfMonth.setDate(days);

    const startOfMonth = subDays(endOfMonth, days - 1);


    //Adding days before
    for(let i = startOfMonth.getDay() -1; i > 0; i--) {
      const newDate = subDays(startOfMonth, startOfMonth.getDay() - i);

      this.monthItems.push({
        column: (i == 0) ? 7 : i,
        row: this.startingRow,
        events: this.getEventsForDate(newDate),
        date: newDate,
        isInScope: false
      })
    }

    const addedDays = this.monthItems.length

    for(let i = 1;  i <= days; i++) {
      const newDate = new Date(this.focusDay.getFullYear(), this.focusDay.getMonth(), i);
      this.monthItems.push({
        column: newDate.getDay() == 0 ? 7 : newDate.getDay(),
        row: Math.floor((i + addedDays - 1) / 7) + this.startingRow,
        events: this.getEventsForDate(newDate),
        date: newDate,
        isInScope: true
      })

    }

    for(let i = endOfMonth.getDay() + 1; i <= 7; i++) {
      const newDate = addDays(endOfMonth, i - endOfMonth.getDay());

      this.monthItems.push({
        column: i,
        row: this.endingRow,
        events: this.getEventsForDate(newDate),
        date: newDate,
        isInScope: false
      })
    }

    console.log(this.monthItems)

  }

  private getEventsForDate(date: Date): CalenderEvent[] {
    // Creëer een nieuwe datum met alleen de jaar, maand, en dag componenten
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return this.events.filter((event: CalenderEvent) => {
      // Normaliseer de start- en einddatum van het evenement
      const startDate = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate());
      const endDate = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate());

      // Controleer of de meegegeven datum binnen de start- en einddatum van het evenement valt
      return checkDate >= startDate && checkDate <= endDate;
    });
  }


  formatMonthName(date :Date) {
    return new Promise<string>(resolve => this.translate.get("config.language").subscribe({
      next: (value) => {
        resolve(this.capitalizeFirstLetter(date.toLocaleString(value, { month: 'long' })))
      }
    }))
  }

  private capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  areDatesTheSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}

export interface MonthItem {
  column: number,
  row: number,
  events: CalenderEvent[],
  date: Date,
  isInScope: boolean

}
