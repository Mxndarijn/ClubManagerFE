import {Component, OnInit} from '@angular/core';
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  UpdateUserModalComponent
} from "../../../AssociationModule/modals/update-user-modal/update-user-modal.component";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {Reservation, ReservationUser} from "../../../../CoreModule/models/reservation.model";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";


enum Tab {
  FUTURE,
  HISTORY
}


@Component({
  selector: 'app-my-reservations-page',
  standalone: true,
  imports: [
    TranslateModule,
    AsyncPipe,
    ConfirmationModalComponent,
    FaIconComponent,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    UpdateUserModalComponent
  ],
  templateUrl: './my-reservations-page.component.html',
  styleUrl: './my-reservations-page.component.css'
})
export class MyReservationsPageComponent implements OnInit {
  activeTab: Tab = Tab.FUTURE;
  protected readonly Tab = Tab;
  protected futureReservationsUsers : ReservationUser[] = []


  constructor(
    private graphQL: GraphQLCommunication,
    protected util: UtilityFunctions,
    private alertService : AlertService,
    private navigationService : NavigationService,
    private translate: TranslateService,
  ) {
    navigationService.showNavigation();
    this.translate.get('myReservations.Title').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

  }

  ngOnInit(): void {
    const startDate = new Date().toISOString();
    this.graphQL.getMyReservations(startDate, "").then(response => {
      console.log(response)
      if(response == null) {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er ging iets mis tijdens het ophalen van de gegevens.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
        return
      }
      this.futureReservationsUsers = response.reservations.sort((a: ReservationUser, b: ReservationUser) => {
        return new Date(a.reservation.startDate).getTime() - new Date(b.reservation.startDate).getTime();
      });
    })
  }


  setActiveTab(tab: Tab) {
    this.activeTab = tab;

  }

  protected readonly Modal = Modal;
  protected readonly faTrashCan = faTrashCan;

  viewMoreInformation(reservationUser : ReservationUser) {

  }
}
