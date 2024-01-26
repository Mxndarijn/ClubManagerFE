import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
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


@Component({
  selector: 'app-calender-week',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle,
    NgComponentOutlet,
  ],
  templateUrl: './calender-week.component.html',
  styleUrls: ['./calender-week.component.css']
})

export class CalenderWeekComponent implements AfterViewInit {
  @ViewChild('eventTemplate', { read: ViewContainerRef }) eventTemplateHolder!: ViewContainerRef
  @Input() events: CalenderEvent[] = [{
    startDate: new Date(2024, 0, 24, 16, 0),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 1),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "red",
      primaryColor: "#8C0202",
      secondaryColor: "#DBB8B8"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abc"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 17, 10),
    endDate: addHours(new Date(2024, 0, 24, 17, 4), 1),
    title: "Kiekeboe1",
    description: "test desc",
    color: {
      colorName: "blue",
      primaryColor: "#0D028C",
      secondaryColor: "#BFB8DB"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abcd"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 16, 10),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "green",
      primaryColor: "#028C20",
      secondaryColor: "#BADBB8"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abcde"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 12, 10),
    endDate: addHours(new Date(2024, 0, 24, 12, 4), 20),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "yellow",
      primaryColor: "#D9DD13",
      secondaryColor: "#DBD9B8"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abcdef"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 11, 10),
    endDate: addHours(new Date(2024, 0, 24, 12, 4), 1),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "blue",
      primaryColor: "#0D028C",
      secondaryColor: "#BFB8DB"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abcee"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  }, {
    startDate: new Date(2024, 0, 24, 16, 10),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "blue",
      primaryColor: "#0D028C",
      secondaryColor: "#BFB8DB"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "abc11"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 25, 13, 10),
    endDate: addHours(new Date(2024, 0, 25, 13, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: {
      colorName: "blue",
      primaryColor: "#0D028C",
      secondaryColor: "#BFB8DB"
    },
    data: {},
    width:100,
    columnIndex: -1,
    id: "aabc"

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },
    //{
  //   startDate: new Date(),
  //   endDate: addHours(new Date(), 2),
  //   title: "Kiekeboe",
  //   description: "test desc",
  //   color: "#0b3ba4",
  //   data: {},
  //   width: 100,
  //   columnIndex: -1
  //
  //   // onClickEventEmitter: EventEmitter<CalenderEvent>
  // }
  ]
  private locale: string = "en-EN"
  protected hours: HourRow[] = [];
  protected days: ColumnDay[] = [];
  protected dayStrings: string[] = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"]
  private startHour = 7;
  private endHour = 22;
  protected currentDay = new Date();
  private weekStartDay = new Date(2024, 0, 22)


  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {
    let i = 0;
    this.dayStrings.forEach(v => {
      this.days.push({
        name: v,
        date: addDays(this.weekStartDay, i)
      });
      i++;
    });
    this.translateService.get("config.language").subscribe({
      next: (response) => {
        this.locale = response;
        for (let i = this.startHour; i <= this.endHour; i++) {
          this.hours.push({hourNumber: i, displayName: this.formatTime(i, 0)});
        }
      }
    })
  }

  ngAfterViewInit(): void {
    const beginTime = this.hours[0].hourNumber; // bijvoorbeeld 10
    const endTime = this.hours[this.hours.length - 1].hourNumber; // bijvoorbeeld 20
    const multipleDayEvents: CalenderEvent[] = [];

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
    });
    this.events = multipleDayEvents;


    this.events.sort((a, b) => {
      if (a.startDate.getDate() !== b.startDate.getDate()) {
        return a.startDate.getDate() - b.startDate.getDate();
      } else if (a.startDate.getHours() !== b.startDate.getHours()) {
        return a.startDate.getHours() - b.startDate.getHours();
      } else {
        const durationA = a.endDate.getTime() - a.startDate.getTime();
        const durationB = b.endDate.getTime() - b.startDate.getTime();
        return durationA - durationB;
      }
    });

    let currentTime = new Date(this.weekStartDay);

    const endDate = addDays(new Date(this.weekStartDay), 7);

    while(currentTime <= endDate) {
      const currentTimeEvents = this.getAllEventsOnSpecificTime(currentTime);
      if(currentTimeEvents.length == 0) {
        currentTime = addMinutes(currentTime, 5)
        continue
      }
      const percentage = Math.floor(100 / currentTimeEvents.length);
      currentTimeEvents.forEach(event => {
        event.width = Math.min(event.width, percentage);
        this.events.filter(e => {
          return e.id == event.id
        }).forEach(e => {
          e.width = event.width;
        })
      })
      currentTime = addMinutes(currentTime, 5)
    }

    this.events.sort((a,b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    })

    this.events.forEach(event => {

      let availableSpace = Array.from(Array(100).keys());
      const allEventsOnTime = this.getAllEventsOnSpecificTime(event.startDate);

      allEventsOnTime.forEach(e => {
        if(e.columnIndex != -1 && e != event) {
          for (let i = e.columnIndex; i < e.columnIndex + e.width; i++) {
            availableSpace = availableSpace.filter(item => item !== i);
          }
        }
      })

      let index = this.findEarliestPossibleLocation(availableSpace, event)
      console.log(index)
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

    this.events.forEach(event=> {
      const eventComponent = this.eventTemplateHolder.createComponent(CalenderWeekEventComponent);
        setTimeout(() => {
          eventComponent.instance.calendarEvent = event;
          const nativeElement = eventComponent.location.nativeElement;

            this.renderer.setStyle(nativeElement, "grid-column-start", this.getCorrectColumn(event.startDate))
            this.renderer.setStyle(nativeElement, "grid-row-start", this.getCorrectRow(event.startDate))
            this.renderer.setStyle(nativeElement, "grid-row-end", this.getCorrectRow(event.endDate))
            this.renderer.setStyle(nativeElement, "width",event.width + "%")
            console.log(event.columnIndex)
            this.renderer.setStyle(nativeElement, "left",event.columnIndex + "%")
            this.renderer.addClass(nativeElement, "relative")


        });
    });


    console.log(this.events);
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

  private getAllEventsOnSpecificTime(currentTime: Date) {
    return this.events.filter(event => {
      return currentTime < event.endDate && event.startDate <= currentTime
    });
  }

  private findEarliestPossibleLocation(freeSpace: number[], event: { width: number }): number {
    let requiredLength = event.width;
    let startingIndex = -1;
    let count = 0;

    let min = Math.min(...freeSpace)
    let max = Math.max(...freeSpace)

    console.log(freeSpace)


    for (let currentValue = min; currentValue <= max; currentValue++) {
      if (freeSpace.includes(currentValue)) {
        if (startingIndex === -1) {
          startingIndex = currentValue;
        }
        count++;
        if (count === requiredLength) {
          console.log("Found: " + count)
          return startingIndex;
        }
      } else {
        startingIndex = -1;
        count = 0;
      }
    }

    return -1;
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


