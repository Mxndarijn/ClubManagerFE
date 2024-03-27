import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit, Output,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UpcomingEventsComponent} from "../upcoming-events/upcoming-events.component";
import {UpdateButtonComponent} from "../../../../app/SharedModule/components/buttons/update-button/update-button.component";
import {CalenderWeekComponent} from "../calender-week/calender-week.component";
import {addHours} from "date-fns";
import {BehaviorSubject} from "rxjs";
import {CalendarDayComponent} from "../calendar-day/calendar-day.component";
import {KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CalendarMonthComponent} from "../calendar-month/calendar-month.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UtilityFunctions} from "../../../utilities/utility-functions";
import { Modal } from '../../../../app/CoreModule/services/modal.service';
import {ColorPreset} from "../../../../app/CoreModule/models/color-preset.model";


@Component({
    selector: 'app-calender',
    standalone: true,
  imports: [
    UpcomingEventsComponent,
    UpdateButtonComponent,
    CalenderWeekComponent,
    CalendarDayComponent,
    NgSwitch,
    NgSwitchCase,
    CalendarMonthComponent,
    NgForOf,
    KeyValuePipe,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
    templateUrl: './calender-view.component.html',
    styleUrl: './calender-view.component.css'
  }
)


export class CalenderViewComponent implements OnInit {
  @Output() readonly RequestNewCalendarItemsEvent = new EventEmitter<Date>();
  @Output() readonly CalendarItemClickedEvent = new EventEmitter<CalenderEvent>();
  @Output() readonly ButtonClickedEvent = new EventEmitter<void>();
  @Input() NewCalendarItemsEvent : EventEmitter<CalenderEvent[]> | undefined
  @Input()  buttonTitle: string = "";

  protected focusDayChangedEvent = new BehaviorSubject<Date>(new Date());
  protected eventsChangedEvent = new BehaviorSubject<CalenderEvent[]>([]);
  protected focusDay = new Date()
  protected currentDay = new Date()
  protected currentView = CalendarView.WEEK;
  protected associationID: string;
  @Input() events: CalenderEvent[] = []
  @ViewChild('viewSelector') myDetails!: ElementRef;

  protected timeFormControl: FormControl


  private route: ActivatedRoute;

  private util: UtilityFunctions;

  constructor(
    private renderer: Renderer2,
    util: UtilityFunctions,
    route: ActivatedRoute
  ) {
    this.util = util;
    this.route = route;
    this.focusDayChangedEvent.next(this.focusDay);
    this.eventsChangedEvent.next(this.events)

    this.timeFormControl = new FormControl<string>(util.formatDateForFormControl(this.focusDay))
    this.associationID = route.snapshot.params['associationID'];
    this.timeFormControl.valueChanges.subscribe({
      next: (value ) => {
        this.focusDay = new Date(value);
        this.focusDayChangedEvent.next(this.focusDay);
        this.RequestNewCalendarItemsEvent.next(this.focusDay);

      }
    })
  }

  ngOnInit(): void {
        this.NewCalendarItemsEvent?.subscribe({
          next: (events: CalenderEvent[]) => {
            this.events = events
            this.eventsChangedEvent.next(this.events);
          }
        })
    this.RequestNewCalendarItemsEvent.next(this.focusDay);
    }

  protected readonly Modal = Modal;
  protected readonly CalendarView = CalendarView;
  @Input() showButton = true;

  setCurrentView(key: string) {
    this.currentView = this.CalendarView[key as keyof typeof CalendarView]
    this.renderer.removeAttribute(this.myDetails.nativeElement, 'open')

  }
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
  MONTH = "Maand overzicht",
  WEEK = "Week overzicht",
  DAY = "Dag overzicht"
}
