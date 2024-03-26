import {Component, EventEmitter} from '@angular/core';
import {SideBarComponent} from "../../navigation/side-bar/side-bar.component";
import {CalenderEvent, CalenderViewComponent} from "../../calender/calender-view/calender-view.component";
import {NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [
    SideBarComponent,
    CalenderViewComponent,
    NgSwitchCase,
    NgSwitch
  ],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css'
})
export class ReservationPageComponent {

  protected readonly Tab = Tab;
  protected activeTab = Tab.RESERVATIONS;
  newWeaponCalendarEvent = new  EventEmitter<CalenderEvent[]>();
  newReservationCalendarEvent = new  EventEmitter<CalenderEvent[]>();

  updateWeaponEvents(date: Date) {

  }

  weaponCalendarItemClicked(event: CalenderEvent) {

  }

  createNewWeaponReservation() {

  }

  updateReservationEvent(date: Date) {

  }

  reservationCalendarItemClicked(event: CalenderEvent) {

  }
}

enum Tab {
  RESERVATIONS= 0,
  WEAPONS= 1
}

