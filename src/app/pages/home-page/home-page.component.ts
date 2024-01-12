import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from "../../navigation/side-bar/side-bar.component";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {NgForOf} from "@angular/common";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../../helpers/token.interceptor";
import {environment} from "../../../environment/environment";
import {RouterOutlet} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import {NavbarComponent} from "../../navigation/navbar/navbar.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, NgForOf, RouterOutlet, NavbarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    // ... other providers
  ],
})
export class HomePageComponent {

  associations: any[] = [];

  constructor(graphQLCommunication: GraphQLCommunication, navigationService: NavigationService,
              private translate: TranslateService) {

    navigationService.showNavigation();
    this.translate.get('homePage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    navigationService.setSubTitle("");
    graphQLCommunication.getMyAssociations().subscribe({
      next: (response) => {
        this.associations = response.data.getMyAssociations;
      },
      error: (error) => {
        console.log(error);
      }
    });


  }


  protected readonly environment = environment;
}
