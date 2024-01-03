import { Component } from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";
import {AccountIconComponent} from "../account-icon/account-icon.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, AccountIconComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
