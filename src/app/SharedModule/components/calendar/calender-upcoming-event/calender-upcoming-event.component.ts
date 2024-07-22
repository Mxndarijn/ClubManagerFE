import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {CalendarEvent} from "../calender-view/calender-view.component";
import {NgClass} from "@angular/common";
import {UtilityFunctions} from "../../../utilities/utility-functions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-calender-upcoming-event',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './calender-upcoming-event.component.html',
  styleUrl: './calender-upcoming-event.component.css'
})
export class CalenderUpcomingEventComponent implements OnInit, OnDestroy {
  @Input() calendarEvent!: CalendarEvent
  @Input() index!: number
  @Input() calendarItemClickedEvent? : EventEmitter<CalendarEvent>
  private subscriptions: Subscription[] = [];

  protected time: string = ""

  constructor(
    private utility: UtilityFunctions
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.utility.formatDateTime(this.calendarEvent.startDate).subscribe({
      next: (result) => {
        this.time = result;
      },
      error: (err) => {
        console.error('Error formatting date', err);
      }
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

}
