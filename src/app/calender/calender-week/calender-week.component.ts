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
    color: "#a40b0b",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 17, 10),
    endDate: addHours(new Date(2024, 0, 24, 17, 4), 1),
    title: "Kiekeboe1",
    description: "test desc",
    color: "#0ba4a4",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 16, 10),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: "#a40b0b",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 12, 10),
    endDate: addHours(new Date(2024, 0, 24, 12, 4), 8),
    title: "Kiekeboe",
    description: "test desc",
    color: "#0b1aa4",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 24, 11, 10),
    endDate: addHours(new Date(2024, 0, 24, 12, 4), 1),
    title: "Kiekeboe",
    description: "test desc",
    color: "#a40b0b",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  }, {
    startDate: new Date(2024, 0, 24, 16, 10),
    endDate: addHours(new Date(2024, 0, 24, 16, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: "#a40b0b",
    data: {},
    width:100,
    columnIndex: -1

    // onClickEventEmitter: EventEmitter<CalenderEvent>
  },{
    startDate: new Date(2024, 0, 25, 13, 10),
    endDate: addHours(new Date(2024, 0, 25, 13, 4), 2),
    title: "Kiekeboe",
    description: "test desc",
    color: "#a40b0b",
    data: {},
    width:100,
    columnIndex: -1

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
  protected days: string[] = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"]
  private startHour = 7;
  private endHour = 22;
  private weekStartDay = new Date(2024, 0, 22)


  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2
  ) {
    this.translateService.get("config.language").subscribe({
      next: (response) => {
        this.locale = response;
        for (let i = this.startHour; i <= this.endHour + 1; i++) {
          this.hours.push({hourNumber: i, displayName: this.formatTime(i, 0)});
        }
      }
    })
  }

  ngAfterViewInit(): void {
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
      })


      // let currentSpace = 0;
      // const spaceOccupied = Array.from(Array(100).keys());
      // currentTimeEvents.forEach(event => {
      //   if(event.columnIndex != -1) {
      //     for(let i = event.columnIndex; i <= event.columnIndex + event.width; i++) {
      //       spaceOccupied.splice(i);
      //     }
      //   }
      // })
      //
      // currentTimeEvents.forEach(event => {
      //   if(event.columnIndex == -1) {
      //     event.columnIndex = currentSpace;
      //     currentSpace += event.width;
      //     const index = this.findEarliestPossibleLocation(spaceOccupied, event)
      //     console.log(index)
      //     if(index == -1) {
      //       console.log("Could not find a place for event: " + JSON.stringify(event))
      //     } else {
      //       event.columnIndex = index;
      //       for(let i = event.columnIndex; i <= event.columnIndex + event.width; i++) {
      //         console.log("removing " + i)
      //         spaceOccupied.splice(i);
      //       }
      //     }
      //   }
      // })
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

      const index = this.findEarliestPossibleLocation(availableSpace, event)
      console.log(index)
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

    return hours + minutes + 1;
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
}



export interface HourRow {
  hourNumber: number,
  displayName: string,

}


