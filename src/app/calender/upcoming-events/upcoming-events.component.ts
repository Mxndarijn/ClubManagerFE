import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './upcoming-events.component.html',
  styleUrl: './upcoming-events.component.css'
})
export class UpcomingEventsComponent implements OnInit {
  @Input() eventsChangedEvent! : BehaviorSubject<CalenderEvent[]>
  @Input() currentDay!: Date
  protected events: CalenderEvent[] = [];


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
