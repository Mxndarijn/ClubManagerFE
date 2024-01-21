import { Component } from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarModule, CalendarView} from "angular-calendar";
import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from "rxjs";
import { EventColor } from 'calendar-utils';
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";

const {blue, red, yellow}: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-calender',
  standalone: true,
    imports: [
      CalendarModule,
      NgSwitchCase,
      NgSwitch,
      NgIf
    ],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
}

)


export class CalenderComponent {

  protected readonly CalendarView = CalendarView;
  viewDate = new Date();
  refresh = new Subject<void>();

  actions: CalendarEventAction[] = [
  ];


  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...(red) },
      actions: this.actions,
      allDay: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...(yellow) },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...(blue) },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...(yellow) },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];
  view = CalendarView.Week;
  activeDayIsOpen: boolean = false;


  eventTimesChanged($event: any) {

  }

  handleEvent(clicked: string, $event: { event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent }) {

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      // this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
      //   events.length === 0);
      // this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

}
