import {Component, EventEmitter, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UpcomingEventsComponent} from "../upcoming-events/upcoming-events.component";
import {UpdateButtonComponent} from "../../buttons/update-button/update-button.component";
import {Modal} from "../../services/modal.service";
import {CalenderSwitchComponent} from "../calender-switch/calender-switch.component";
import {CalenderDateOverviewComponent} from "../calender-date-overview/calender-date-overview.component";
import {CalenderWeekComponent} from "../calender-week/calender-week.component";
import {ColorPreset} from "../../../model/color-preset.model";
import {addHours} from "date-fns";
import {BehaviorSubject} from "rxjs";
import {CalendarDayComponent} from "../calendar-day/calendar-day.component";
import {NgSwitch, NgSwitchCase} from "@angular/common";

// import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';


@Component({
    selector: 'app-calender',
    standalone: true,
  imports: [
    UpcomingEventsComponent,
    UpdateButtonComponent,
    CalenderSwitchComponent,
    CalenderDateOverviewComponent,
    CalenderWeekComponent,
    CalendarDayComponent,
    NgSwitch,
    NgSwitchCase,
  ],
    templateUrl: './calender-view.component.html',
    styleUrl: './calender-view.component.css'
  }
)


export class CalenderViewComponent {
  protected focusDayChangedEvent = new BehaviorSubject<Date>(new Date());
  protected eventsChangedEvent = new BehaviorSubject<CalenderEvent[]>([]);
  protected focusDay = new Date(2024, 0, 24, 17, 10)
  protected currentDay = new Date();
  protected currentView = CalendarView.WEEK;
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

  },{
    startDate: new Date(2024, 0, 27, 13, 10),
    endDate: addHours(new Date(2024, 0, 27, 13, 4), 2),
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

  }]


  constructor() {
    this.focusDayChangedEvent.next(this.focusDay);
    this.eventsChangedEvent.next(this.events)
  }

  protected readonly Modal = Modal;
  protected readonly CalendarView = CalendarView;
}

export interface CalenderEvent {
  startDate: Date,
  endDate: Date,
  title: string,
  description: string,
  color: ColorPreset,
  data: any,
  width: number // Percentage
  columnIndex: number,
  id: string
  // onClickEventEmitter: EventEmitter<CalenderEvent>


}

export enum CalendarView {
  MONTH,
  WEEK,
  DAY
}
