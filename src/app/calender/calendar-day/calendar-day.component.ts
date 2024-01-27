import {AfterViewInit, Component, Input, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {TranslateService} from "@ngx-translate/core";
import {addDays, addMinutes} from "date-fns";
import {CalenderWeekEventComponent} from "../calender-week-event/calender-week-event.component";
import {ColumnDay, HourRow} from "../calender-week/calender-week.component";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.css'
})
export class CalendarDayComponent implements AfterViewInit, OnInit {
  @Input() focusDayChangedEvent! : BehaviorSubject<Date>
  @Input() eventsChangedEvent! : BehaviorSubject<CalenderEvent[]>
  @Input() currentDay!: Date

  @ViewChild('eventTemplate', { read: ViewContainerRef }) eventTemplateHolder!: ViewContainerRef

  private events: CalenderEvent[] = []
  private locale: string = "en-EN"
  protected hours: HourRow[] = [];
  private startHour = 7;
  private endHour = 22;

  protected selectedDay: Date = new Date();


  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {
    this.translateService.get("config.language").subscribe({
      next: (response) => {
        this.locale = response;
        for (let i = this.startHour; i <= this.endHour; i++) {
          this.hours.push({hourNumber: i, displayName: this.formatTime(i, 0)});
        }
      }
    })
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
          this.selectedDay = date;
        }
      })
    });
  }

  refreshEvents() {

    if(this.eventTemplateHolder == null)
      return;
    let beginTime = this.hours[0].hourNumber; // bijvoorbeeld 10
    let endTime = this.hours[this.hours.length - 1].hourNumber; // bijvoorbeeld 20
    let multipleDayEvents: CalenderEvent[] = [];

    let currentTime = new Date(this.selectedDay);
    currentTime.setHours(beginTime);
    currentTime.setMinutes(0);
    let endTimeDate = new Date(currentTime);
    endTimeDate.setHours(endTime);
    endTimeDate.setMinutes(60);

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

          multipleDayEvents.push({
            ...event,
            startDate: new Date(currentStart),
            endDate: currentEnd
          });

          // Bereid de starttijd voor de volgende dag voor
          currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() + 1); // Ga naar de volgende dag
          currentStart.setHours(beginTime, 0, 0, 0); // Stel begintijd in op de volgende dag
        }
      } else {
        // Voeg het enkele-dag evenement toe
        multipleDayEvents.push(event);
      }
    })

    let eventsOnSpecificDay = multipleDayEvents.filter(event => {
      return this.areDatesTheSameDay(event.startDate, currentTime)
    });


    // eventsOnSpecificDay.sort((a, b) => {
    //   if (a.startDate.getDate() !== b.startDate.getDate()) {
    //     return a.startDate.getDate() - b.startDate.getDate();
    //   } else if (a.startDate.getHours() !== b.startDate.getHours()) {
    //     return a.startDate.getHours() - b.startDate.getHours();
    //   } else {
    //     let durationA = a.endDate.getTime() - a.startDate.getTime();
    //     let durationB = b.endDate.getTime() - b.startDate.getTime();
    //     return durationA - durationB;
    //   }
    // });


    while(currentTime <= endTimeDate) {
      const currentTimeEvents = this.getAllEventsOnSpecificTime(eventsOnSpecificDay, currentTime);
      if(currentTimeEvents.length == 0) {
        currentTime = addMinutes(currentTime, 5)
        continue
      }
      const percentage = Math.floor(100 / currentTimeEvents.length);
      currentTimeEvents.forEach(event => {
        event.width = Math.min(event.width, percentage);
        eventsOnSpecificDay.filter(e => {
          return e.id == event.id
        }).forEach(e => {
          e.width = event.width;
        })
      })
      currentTime = addMinutes(currentTime, 5)
    }

    eventsOnSpecificDay.sort((a,b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    })

    eventsOnSpecificDay.forEach(event => {

      let availableSpace = Array.from(Array(100).keys());
      const allEventsOnTime = this.getAllEventsOnSpecificTime(eventsOnSpecificDay, event.startDate);

      allEventsOnTime.forEach(e => {
        if(e.columnIndex != -1 && e != event) {
          for (let i = e.columnIndex; i < e.columnIndex + e.width; i++) {
            availableSpace = availableSpace.filter(item => item !== i);
          }
        }
      })

      let index = this.findEarliestPossibleLocation(availableSpace, event)
      if(index == -1) {
        index = this.findBiggestPossibleLocation(availableSpace);
      }
      if(index == -1) {
        console.log("Could not find a place for event: " + JSON.stringify(event))
      } else {
        event.columnIndex = index;
        for(let i = event.columnIndex; i <= event.columnIndex + event.width; i++) {
          for (let i = event.columnIndex; i < event.columnIndex + event.width; i++) {
            availableSpace = availableSpace.filter(item => item !== i);
          }

        }
      }
    })

    this.eventTemplateHolder.clear();
    eventsOnSpecificDay.forEach(event=> {
      const eventComponent = this.eventTemplateHolder.createComponent(CalenderWeekEventComponent);
      eventComponent.instance.calendarEvent = event;
      const nativeElement = eventComponent.location.nativeElement;

      this.renderer.setStyle(nativeElement, "grid-column-start", 2)
      this.renderer.setStyle(nativeElement, "grid-row-start", this.getCorrectRow(event.startDate))
      this.renderer.setStyle(nativeElement, "grid-row-end", this.getCorrectRow(event.endDate))
      this.renderer.setStyle(nativeElement, "width",event.width + "%")
      this.renderer.setStyle(nativeElement, "left",event.columnIndex + "%")
      this.renderer.addClass(nativeElement, "relative")
    });
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

  private getAllEventsOnSpecificTime(eventsOnSpecificDay: CalenderEvent[], currentTime: Date) {
    return eventsOnSpecificDay.filter(event => {
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
