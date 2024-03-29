import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CalendarEvent} from "../calender-view/calender-view.component";
import {NgClass, NgStyle} from "@angular/common";
import {UtilityFunctions} from "../../../utilities/utility-functions";
import {CalendarEventData} from "../models/CalendarEventData";
import {CalendarEventCommonComponent} from "../events/calendar-event-common/calendar-event-common.component";

@Component({
  selector: 'app-calender-event',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    CalendarEventCommonComponent
  ],
  templateUrl: './calender-event.component.html',
  styleUrl: './calender-event.component.css'
})
export class CalenderEventComponent implements OnInit {
  @Input() calendarEvent!: CalendarEvent
  @Input() calendarItemClickedEvent?: EventEmitter<CalendarEvent>;
  @Input() componentType?: Type<CalendarEventData>;

  @ViewChild('eventContainer', { read: ViewContainerRef, static: true })
  private eventContainerRef!: ViewContainerRef;

  async ngOnInit() {
    if(this.componentType == null)
      return;
    const compRef = this.eventContainerRef.createComponent(this.componentType);
    compRef.instance.data = this.calendarEvent;
    compRef.instance.calendarItemClickedEvent = this.calendarItemClickedEvent;
  }


  constructor(
    protected utility: UtilityFunctions,
  ) {

  }

  protected readonly console = console;
}
