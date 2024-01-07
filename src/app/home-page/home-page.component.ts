import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";
import {AccountIconComponent} from "../account-icon/account-icon.component";
import {GraphQLCommunication} from "../services/graphql-communication.service";
import {NgForOf} from "@angular/common";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../helpers/token.interceptor";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, AccountIconComponent, NgForOf],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    // ... other providers
  ],
})
export class HomePageComponent {

  associations: any[] = [];

  constructor(graphQLCommunication: GraphQLCommunication) {
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


}
