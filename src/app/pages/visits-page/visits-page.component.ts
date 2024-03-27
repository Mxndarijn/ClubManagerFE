import {Component} from '@angular/core';
import {SideBarComponent} from "../../../SharedModule/components/navigation/side-bar/side-bar.component";

@Component({
  selector: 'app-visits-page',
  standalone: true,
    imports: [
        SideBarComponent
    ],
  templateUrl: './visits-page.component.html',
  styleUrl: './visits-page.component.css'
})
export class VisitsPageComponent {

}
