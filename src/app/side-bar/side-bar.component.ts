import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideBarIcon} from '../side-bar-item/side-bar-item.component';
import {SideBarItemComponent} from '../side-bar-item/side-bar-item.component'
import {environment} from "../../environment/environment";
import {AssociationNameComponent} from "../association-name/association-name.component";
import {ConfirmButtonComponent} from "../buttons/confirm-button/confirm-button.component";
import {RouterOutlet} from "@angular/router";

//Voeg items to voor nieuwe gegevens in de nav
const SIDEBAR_ITEMS: SideBarIcon[] = [
  {
    name: "Home",
    link: "/home"
  },
  {
    name: "Reserveringen",
    link: "/reservations"
  },
  {
    name: "Bezoeken",
    link: "/visits"
  },
  {
    name: "Competitie",
    link: "/competition"
  }
]

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, SideBarItemComponent, AssociationNameComponent, ConfirmButtonComponent, RouterOutlet],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  sidebar_items = SIDEBAR_ITEMS;
  protected readonly environment = environment;
}
