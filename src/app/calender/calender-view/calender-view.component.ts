import {Component, EventEmitter} from '@angular/core';
import {UpcomingEventsComponent} from "../upcoming-events/upcoming-events.component";
import {UpdateButtonComponent} from "../../buttons/update-button/update-button.component";
import {Modal} from "../../services/modal.service";
import {CalenderSwitchComponent} from "../calender-switch/calender-switch.component";
import {CalenderDateOverviewComponent} from "../calender-date-overview/calender-date-overview.component";
import {CalenderWeekComponent} from "../calender-week/calender-week.component";
// import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';


@Component({
  selector: 'app-calender',
  standalone: true,
        imports: [
            UpcomingEventsComponent,
            UpdateButtonComponent,
            CalenderSwitchComponent,
            CalenderDateOverviewComponent,
            CalenderWeekComponent
        ],
  templateUrl: './calender-view.component.html',
  styleUrl: './calender-view.component.css'
}

)


export class CalenderViewComponent {


  protected readonly Modal = Modal;
}

export interface CalenderEvent {
    startDate: Date,
    endDate: Date,
    title: string,
    color: string,
    data: any,
    onClickEventEmitter: EventEmitter<CalenderEvent>



}
