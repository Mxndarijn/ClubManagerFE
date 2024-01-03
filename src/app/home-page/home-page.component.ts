import { Component } from '@angular/core';
import {SideBarComponent} from "../side-bar/side-bar.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
