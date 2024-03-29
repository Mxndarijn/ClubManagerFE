import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {TranslateService} from "@ngx-translate/core";
import {addDays, addMinutes} from "date-fns";
import {CalenderWeekEventComponent} from "../calender-week-event/calender-week-event.component";
import {ColumnDay, HourRow} from "../calender-week/calender-week.component";
import {NgClass, NgForOf, NgStyle} from "@angular/common";
import {UtilityFunctions} from "../../helpers/utility-functions";

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    CalenderWeekEventComponent,
    NgStyle
  ],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.css'
})
export class CalendarDayComponent implements AfterViewInit, OnInit {
  @Input() focusDayChangedEvent! : BehaviorSubject<Date>
  @Input() eventsChangedEvent! : BehaviorSubject<CalenderEvent[]>
  @Input() currentDay!: Date
  @Input() calendarItemClickedEvent? : EventEmitter<CalenderEvent>

  @ViewChild('eventTemplate', { read: ViewContainerRef }) eventTemplateHolder!: ViewContainerRef

  private events: CalenderEvent[] = []
  protected hours: HourRow[] = [];
  private startHour = 7;
  private endHour = 22;
  protected title = "";

  protected selectedDay: Date = new Date();
  protected weekEvents: CalenderEvent[] = [];


  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2,
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
      this.events.length = 0
      this.eventsChangedEvent.subscribe({
        next: (events: CalenderEvent[]) => {
          this.events.length = 0
          this.events = events
          this.refreshEvents();
        }
      })

      this.focusDayChangedEvent.subscribe({
        next: (date: Date) => {
          this.selectedDay = new Date(date);
          this.selectedDay.setHours(0)
          this.selectedDay.setMinutes(0)

            this.utility.formatDate(this.selectedDay).then(result => {
              this.title = result;
            })
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

    multipleDayEvents.forEach(e => {
      e.columnIndex = 2;
    })
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

    const weekEndDate = new Date(this.selectedDay)
    weekEndDate.setHours(23);
    weekEndDate.setMinutes(59)
    multipleDayEvents = multipleDayEvents.filter(event => {
      return this.eventsOverlap(this.selectedDay, weekEndDate, event.startDate, event.endDate)
    });

    return multipleDayEvents;
  }

  assignWidthsToEvents(multipleDayEvents: CalenderEvent[]) {
    let currentTime = new Date(this.selectedDay);
    currentTime.setHours(1)

    let endDate = new Date(this.selectedDay);
    endDate.setHours(23)
    endDate.setMinutes(59)

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.refreshEvents()
    });
  }

  getCorrectRow(date: Date) {

    const hours = (date.getHours() - this.hours[0].hourNumber) * 12;
    const minutes = Math.floor(date.getMinutes() / 5);

    return hours + minutes + 2;
  }

  private getAllEventsOnSpecificTime(eventsOnSpecificDay: CalenderEvent[], currentTime: Date) {
    return eventsOnSpecificDay.filter(event => {
      return currentTime < event.endDate && event.startDate <= currentTime
    });
  }

}
