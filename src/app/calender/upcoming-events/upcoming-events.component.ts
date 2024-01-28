import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {NgClass, NgForOf} from "@angular/common";
import {UtilityFunctions} from "../../helpers/utility-functions";
import {CalenderUpcomingEventComponent} from "../calender-upcoming-event/calender-upcoming-event.component";

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [
    NgForOf,
    CalenderUpcomingEventComponent,
    NgClass
  ],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent implements OnInit {
  @Input() eventsChangedEvent! : BehaviorSubject<CalenderEvent[]>
  @Input() currentDay!: Date
  protected events: CalenderEvent[] = [];

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.eventsChangedEvent.subscribe({
      next: (events) => {
        this.events = events.filter(event => event.endDate > this.currentDay);
        this.events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        this.events = this.events.slice(0, 10);
      }
    });
  }
}
