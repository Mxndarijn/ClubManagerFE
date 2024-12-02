import {Component, EventEmitter, Output} from '@angular/core';
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NgClass, NgForOf} from "@angular/common";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../../../../CoreModule/interceptors/token.interceptor";
import {environment} from "../../../../../environment/environment";
import {RouterOutlet} from "@angular/router";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {Association} from "../../../../CoreModule/models/association.model";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {SideBarComponent} from "../../../../SharedModule/components/navigation/side-bar/side-bar.component";
import {NavbarComponent} from "../../../../SharedModule/components/navigation/navbar/navbar.component";
import {
  UpcomingEventsComponent
} from "../../../../SharedModule/components/calendar/upcoming-events/upcoming-events.component";
import {BehaviorSubject} from "rxjs";
import {CalendarEvent} from "../../../../SharedModule/components/calendar/calender-view/calender-view.component";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {
  RoundedSocialBoxComponent
} from "../../../../SharedModule/components/rounded-social-box/rounded-social-box.component";
import {UserPresence} from "../../../../CoreModule/models/user-presence.model";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, NgForOf, RouterOutlet, NavbarComponent, UpcomingEventsComponent, CustomButton, RoundedSocialBoxComponent, NgClass],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    // ... other providers
  ],
})
export class HomePageComponent {
  // this.days = this.getDaysOfMonth(year, month);
  protected days = this.getDaysOfMonth(new Date())
  protected activeMonth: string = new Date().toLocaleString('default', { month: 'long' });
  protected activeDay: string = new Date().toLocaleString('default', { weekday: 'long' });

// Is van de calendAr moeten we naar kieke
  @Output() readonly CalendarItemClickedEvent = new EventEmitter<CalendarEvent>();
  protected currentDay = new Date()
  protected eventsChangedEvent = new BehaviorSubject<CalendarEvent[]>([]);

  associations: Association[] = [];

  constructor(graphQLCommunication: GraphQLCommunication, navigationService: NavigationService,
              private translate: TranslateService) {

    navigationService.showNavigation();
    this.translate.get('homePage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    navigationService.setSubTitle("");
    graphQLCommunication.getMyAssociations().then( dto =>{
        this.associations = dto.associations.map((assoc: UserAssociation) => assoc.association);
    });

    graphQLCommunication.getUserPresencesWithoutInformation(70).then(response => {
      const data = response.presences.edges.map((edge: any) => edge.node)
      data.forEach((presence : UserPresence) => {
        const presenceDate = new Date(presence.date);
        const day = this.days.find(day => day.date.getDate() == presenceDate.getDate() && day.date.getMonth() == presenceDate.getMonth() && day.date.getFullYear() == presenceDate.getFullYear())
        if(day != null) {
          day.activated = true;
        }
      })
    })



  }


  getDaysOfMonth(date: Date): { day: number | null, activated: boolean, date: Date }[] {
    const days: { day: number | null, activated: boolean, date: Date }[] = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // Dag van de week (0 = zondag)
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Aantal dagen in de maand
    const previousMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); // Dagen in de vorige maand

    // Voeg lege cellen toe voor uitlijning
    const val = (firstDay === 0 ? 6 : firstDay - 1)
    for (let i = 0; i < val; i++) {
      const day = previousMonthDays - val + i;
      days.push({day: day, activated: false, date: new Date(date.getFullYear(), date.getMonth() - 1, day)});
    }

    // Voeg de dagen van de maand toe
    for (let i = 1; i <= totalDays; i++) {
      days.push({day: i, activated: false, date: new Date(date.getFullYear(), date.getMonth(), i)});
    }

    return days;
  }


  protected readonly environment = environment;
  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly Modal = Modal;
}
