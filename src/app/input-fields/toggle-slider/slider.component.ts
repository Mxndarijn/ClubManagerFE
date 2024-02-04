import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-toggle-slider',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  @Input() sliderLabel: string = '';
  @Input() status: boolean = false;

}
