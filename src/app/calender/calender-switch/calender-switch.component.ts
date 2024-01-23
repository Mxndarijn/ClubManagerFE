import { Component } from '@angular/core';
import {CalanderSwitchButtonComponent} from "../../buttons/calander-switch-button/calander-switch-button.component";

@Component({
  selector: 'app-calender-switch-button',
  standalone: true,
  imports: [
    CalanderSwitchButtonComponent
  ],
  templateUrl: './calender-switch.component.html',
  styleUrl: './calender-switch.component.css'
})
export class CalenderSwitchComponent {

}
