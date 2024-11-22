import {Component, EventEmitter, Output} from '@angular/core';
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NgForOf} from "@angular/common";
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
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {
  RoundedSocialBoxComponent
} from "../../../../SharedModule/components/rounded-social-box/rounded-social-box.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, NgForOf, RouterOutlet, NavbarComponent, UpcomingEventsComponent, CustomButton, RoundedSocialBoxComponent],
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



  }


  getDaysOfMonth(date: Date): { day: number | null }[] {
    const days: { day: number | null }[] = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // Dag van de week (0 = zondag)
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Aantal dagen in de maand
    const previousMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); // Dagen in de vorige maand

    // Voeg lege cellen toe voor uitlijning
    const val = (firstDay === 0 ? 6 : firstDay - 1)
    for (let i = 0; i < val; i++) {
      days.push({ day: previousMonthDays -val +  i });
    }

    // Voeg de dagen van de maand toe
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i });
    }

    return days;
  }


  protected readonly environment = environment;
  protected readonly faEnvelope = faEnvelope;
  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly Modal = Modal;
}
