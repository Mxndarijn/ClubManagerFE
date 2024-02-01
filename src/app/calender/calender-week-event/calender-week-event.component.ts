import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CalenderEvent} from "../calender-view/calender-view.component";
import {NgClass, NgStyle} from "@angular/common";
import {UtilityFunctions} from "../../helpers/utility-functions";

@Component({
  selector: 'app-calender-week-event',
  standalone: true,
  imports: [
    NgStyle,
    NgClass
  ],
  templateUrl: './calender-week-event.component.html',
  styleUrl: './calender-week-event.component.css'
})
export class CalenderWeekEventComponent implements OnInit {
  @Input() calendarEvent!: CalenderEvent
  @Input() calendarItemClickedEvent?: EventEmitter<CalenderEvent>;

  // In je component class
  startTime: string = "";

  async ngOnInit() {
    this.startTime = await this.utility.formatTime(this.calendarEvent?.startDate);
  }


  constructor(
    protected utility: UtilityFunctions
  ) {

  }

  protected readonly console = console;
}
