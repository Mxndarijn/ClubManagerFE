import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UpcomingEventsComponent} from "../upcoming-events/upcoming-events.component";
import {UpdateButtonComponent} from "../../buttons/update-button/update-button.component";
import {Modal} from "../../services/modal.service";
import {CalenderWeekComponent} from "../calender-week/calender-week.component";
import {ColorPreset} from "../../../model/color-preset.model";
import {addHours} from "date-fns";
import {BehaviorSubject} from "rxjs";
import {CalendarDayComponent} from "../calendar-day/calendar-day.component";
import {KeyValuePipe, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CalendarMonthComponent} from "../calendar-month/calendar-month.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UtilityFunctions} from "../../helpers/utility-functions";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {ActivatedRoute} from "@angular/router";
import {
  GetWeaponMaintenancesDTO
} from "../../../model/dto/get-weapon-maintenances-dto";

// import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';


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
  ],
    templateUrl: './calender-view.component.html',
    styleUrl: './calender-view.component.css'
  }
)


export class CalenderViewComponent {
  protected focusDayChangedEvent = new BehaviorSubject<Date>(new Date());
  protected eventsChangedEvent = new BehaviorSubject<CalenderEvent[]>([]);
  protected focusDay = new Date()
  protected currentDay = new Date()
  protected currentView = CalendarView.WEEK;
  protected associationID: string;
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
  @ViewChild('viewSelector') myDetails!: ElementRef;

  protected timeFormControl: FormControl


  private route: ActivatedRoute;

  private util: UtilityFunctions;

  constructor(
    private renderer: Renderer2,
    util: UtilityFunctions,
    private graphQLService: GraphQLCommunication,
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
        this.updateEvents()

      }
    })
    this.updateEvents()
  }

  protected readonly Modal = Modal;
  protected readonly CalendarView = CalendarView;

  setCurrentView(key: string) {
    this.currentView = this.CalendarView[key as keyof typeof CalendarView]
    this.renderer.removeAttribute(this.myDetails.nativeElement, 'open')

  }
  updateEvents() {
    this.graphQLService.getAssociationMaintenances(this.associationID, this.focusDay).subscribe({
      next: (response) => {
        const dto : GetWeaponMaintenancesDTO = response.data.getWeaponMaintenancesBetween;
        if(dto.success) {
          const newEvents: CalenderEvent[] = []
          dto.maintenances.forEach(maintenance => {
            newEvents.push({
              title: maintenance.title,
              description: maintenance.description,
              id: maintenance.id,
              color: maintenance.colorPreset,
              data: maintenance,
              width: 100,
              columnIndex: -1,
              startDate: maintenance.startDate,
              endDate: maintenance.endDate
            })
          });
          this.events = newEvents;
          this.eventsChangedEvent.next(this.events);

        } else {
          console.log("Could not request events")
          console.log(response)
        }

      }
    })
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
