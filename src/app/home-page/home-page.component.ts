import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";
import {GraphQLCommunication} from "../services/graphql-communication.service";
import {NgForOf} from "@angular/common";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../helpers/token.interceptor";
import {environment} from "../../environment/environment";
import {RouterOutlet} from "@angular/router";
import {SidebarService} from "../services/sidebar.service";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, NgForOf, RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    // ... other providers
  ],
})
export class HomePageComponent {

  associations: any[] = [];

  constructor(graphQLCommunication: GraphQLCommunication, sidebarService: SidebarService) {
    sidebarService.showSidebar();
    graphQLCommunication.getMyAssociations().subscribe({
      next: (response) => {
        console.log(response)
        this.associations = response.data.getMyAssociations;
      },
      error: (error) => {
        console.log(error);
      }
    });


  }


  protected readonly environment = environment;
}
