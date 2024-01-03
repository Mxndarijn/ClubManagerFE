import { Component } from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";

@Component({
  selector: 'app-reservation-page',
  standalone: true,
    imports: [
        SideBarComponent
    ],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css'
})
export class ReservationPageComponent {

}
