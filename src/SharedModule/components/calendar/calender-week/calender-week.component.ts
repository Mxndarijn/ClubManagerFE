import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef, EventEmitter,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CalenderEvent} from "../calender-view/calender-view.component";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgComponentOutlet, NgForOf, NgIf, NgStyle} from "@angular/common";
import {addDays, addHours, addMinutes, differenceInMinutes} from "date-fns";
import {CalenderWeekEventComponent} from "../calender-week-event/calender-week-event.component";
import {BehaviorSubject} from "rxjs";
import {UtilityFunctions} from "../../../utilities/utility-functions";


@Component({
  selector: 'app-calender-week',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle,
    NgComponentOutlet,
    CalenderWeekEventComponent,
  ],
  templateUrl: './calender-week.component.html',
  styleUrls: ['./calender-week.component.css']
})

export class CalenderWeekComponent implements AfterViewInit, OnInit {
  @Input() focusDayChangedEvent!: BehaviorSubject<Date>
  @Input() eventsChangedEvent!: BehaviorSubject<CalenderEvent[]>
  @Input() calendarItemClickedEvent? : EventEmitter<CalenderEvent>
  @Input() currentDay!: Date

  private events: CalenderEvent[] = []
  protected hours: HourRow[] = [];
  protected days: ColumnDay[] = [];
  protected dayStrings: string[] = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"]
  private startHour = 7;
  private endHour = 22;
  private weekStartDay!: Date

  protected weekEvents: CalenderEvent[] = [];


  constructor(
    private translateService: TranslateService,
    private utility: UtilityFunctions
  ) {
    for (let i = this.startHour; i <= this.endHour; i++) {
      utility.formatTimeI(i, 0).then(displayName => {
        this.hours.push({hourNumber: i, displayName: displayName});
      })
    }
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
          this.weekStartDay = this.toStartOfWeek(date);
          let i = 0;
          this.days = []
          this.dayStrings.forEach(v => {
            this.days.push({
              name: v,
              date: addDays(this.weekStartDay, i)
            });
            i++;
          });
          this.refreshEvents()
        }
      })
    });
  }

  refreshEvents() {

    let beginTime = this.hours[0].hourNumber; // bijvoorbeeld 10
    let endTime = this.hours[this.hours.length - 1].hourNumber; // bijvoorbeeld 20
    let multipleDayEvents = this.calculateMultiDayEvents(beginTime, endTime)

    this.assignWidthsToEvents(multipleDayEvents);

    multipleDayEvents.sort((a, b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    })

    this.assignColumnsToEvents(multipleDayEvents);
    this.weekEvents = multipleDayEvents
  }

  calculateMultiDayEvents(beginTime: number, endTime: number) {
    let multipleDayEvents: CalenderEvent[] = [];

    this.events.forEach(event => {
      if (event.startDate.getDay() !== event.endDate.getDay()) {
        let currentStart = new Date(event.startDate);

        while (currentStart < event.endDate) {
          let currentEnd = new Date(currentStart);
          currentEnd.setHours(endTime, 60, 0, 0); // Stel eindtijd in op dezelfde dag

          // Als de berekende eindtijd na de eigenlijke eindtijd van het evenement ligt, gebruik dan de eigenlijke eindtijd
          if (currentEnd > event.endDate) {
            currentEnd = new Date(event.endDate);
          }

          if(currentStart.getHours() >= beginTime && currentStart.getHours() < endTime) {
            multipleDayEvents.push({
              ...event,
              startDate: new Date(currentStart),
              endDate: currentEnd
            });
          }

          // Bereid de starttijd voor de volgende dag voor
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() + 1); // Ga naar de volgende dag
          currentStart.setHours(beginTime, 0, 0, 0); // Stel begintijd in op de volgende dag
        }
      } else if(event.startDate.getHours() >= beginTime && event.startDate.getHours() < endTime) {
        // Voeg het enkele-dag evenement toe
        multipleDayEvents.push(event);
      }
    });

    const weekEndDate = addDays(new Date(this.weekStartDay), 6)
    weekEndDate.setHours(23);
    weekEndDate.setMinutes(59)
    multipleDayEvents = multipleDayEvents.filter(event => {
      return this.eventsOverlap(this.weekStartDay, weekEndDate, event.startDate, event.endDate)
    });

    return multipleDayEvents;
  }

  assignWidthsToEvents(multipleDayEvents: CalenderEvent[]) {
    let currentTime = new Date(this.weekStartDay);

    let endDate = addDays(new Date(this.weekStartDay), 7);

    while (currentTime <= endDate) {
      const currentTimeEvents = this.getAllEventsOnSpecificTime(multipleDayEvents, currentTime);
      if (currentTimeEvents.length == 0) {
        currentTime = addMinutes(currentTime, 5)
        continue
      }
      const percentage = Math.floor(100 / currentTimeEvents.length);
      currentTimeEvents.forEach(event => {
        event.width = Math.min(event.width, percentage);
        multipleDayEvents.filter(e => {
          return e.id == event.id
        }).forEach(e => {
          e.width = event.width;
        })
      })
      currentTime = addMinutes(currentTime, 5)
    }
  }

  eventsOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    // Zorgt ervoor dat start altijd voor eind komt
    if (startA > endA) [startA, endA] = [endA, startA];
    if (startB > endB) [startB, endB] = [endB, startB];

    // Controleert op overlap
    return startA < endB && endA > startB;
  }

  assignColumnsToEvents(multipleDayEvents: CalenderEvent[]) {
    multipleDayEvents.forEach(event => {

      let availableSpace = Array.from(Array(100).keys());
      const allEventsOnTime = this.getAllEventsOnSpecificTime(multipleDayEvents, event.startDate);

      allEventsOnTime.forEach(e => {
        if (e.columnIndex != -1 && e != event) {
          for (let i = e.columnIndex; i < e.columnIndex + e.width; i++) {
            availableSpace = availableSpace.filter(item => item !== i);
          }
        }
      })

      let index = this.findEarliestPossibleLocation(availableSpace, event)
      if (index == -1) {
        index = this.findBiggestPossibleLocation(availableSpace);
      }
      if (index == -1) {
        console.log("Could not find a place for event: " + JSON.stringify(event))
      } else {
        event.columnIndex = index;
        for (let i = event.columnIndex; i <= event.columnIndex + event.width; i++) {
          for (let i = event.columnIndex; i < event.columnIndex + event.width; i++) {
            availableSpace = availableSpace.filter(item => item !== i);
          }

        }
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.refreshEvents()
    });
  }

  getCorrectColumn(date: Date) {
    const dayOfTheWeek = date.getDay();
    return (dayOfTheWeek === 0) ? 8 : dayOfTheWeek + 1;
  }

  getCorrectRow(date: Date) {

    const hours = (date.getHours() - this.hours[0].hourNumber) * 12;
    const minutes = Math.floor(date.getMinutes() / 5);

    return hours + minutes + 2;
  }


  private getAllEventsOnSpecificTime(multipleDayEvents: CalenderEvent[], currentTime: Date) {
    return multipleDayEvents.filter(event => {
      return currentTime < event.endDate && event.startDate <= currentTime
    });
  }

  private findEarliestPossibleLocation(freeSpace: number[], event: { width: number }): number {
    let requiredLength = event.width;
    let startingIndex = -1;
    let count = 0;

    let min = Math.min(...freeSpace)
    let max = Math.max(...freeSpace)


    for (let currentValue = min; currentValue <= max; currentValue++) {
      if (freeSpace.includes(currentValue)) {
        if (startingIndex === -1) {
          startingIndex = currentValue;
        }
        count++;
        if (count === requiredLength) {
          return startingIndex;
        }
      } else {
        startingIndex = -1;
        count = 0;
      }
    }

    return -1;
  }

  toStartOfWeek(date: Date): Date {
    let day = date.getDay(); // Sunday = 0, Monday = 1, etc.
    let difference = day - 1; // Number of days since Monday

    if (difference < 0) {
      // If the day is Sunday, go back 6 days to the previous Monday.
      difference = 6;
    }

    let startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - difference);
    startOfWeek.setHours(0)
    startOfWeek.setMinutes(0)
    return startOfWeek;
  }

  private findBiggestPossibleLocation(availableSpace: number[]): number {
    let maxSegmentSize = 0;
    let maxSegmentStartIndex = -1;
    let currentSegmentSize = 0;
    let currentSegmentStartIndex = -1;

    for (let i = 0; i < availableSpace.length; i++) {
      if (i === 0 || availableSpace[i] !== availableSpace[i - 1] + 1) {
        // Begin van een nieuw segment
        if (currentSegmentSize > maxSegmentSize) {
          maxSegmentSize = currentSegmentSize;
          maxSegmentStartIndex = currentSegmentStartIndex;
        }
        currentSegmentSize = 1;
        currentSegmentStartIndex = availableSpace[i];
      } else {
        // Voortzetting van het huidige segment
        currentSegmentSize++;
      }
    }

    // Controleer aan het einde nogmaals voor het laatste segment
    if (currentSegmentSize > maxSegmentSize) {
      maxSegmentSize = currentSegmentSize;
      maxSegmentStartIndex = currentSegmentStartIndex;
    }

    return maxSegmentStartIndex;
  }

  areDatesTheSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}


export interface HourRow {
  hourNumber: number,
  displayName: string,

}

export interface ColumnDay {
  name: string,
  date: Date
}


