import { Component } from '@angular/core';
import {SideBarComponent} from "../../navigation/side-bar/side-bar.component";

@Component({
  selector: 'app-competition-page',
  standalone: true,
    imports: [
        SideBarComponent
    ],
  templateUrl: './competition-page.component.html',
  styleUrl: './competition-page.component.css'
})
export class CompetitionPageComponent {

}
