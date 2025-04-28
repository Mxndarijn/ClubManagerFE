import {Component, Input} from '@angular/core';
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-rounded-social-box',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './rounded-social-box.component.html',
  styleUrl: './rounded-social-box.component.css'
})
export class RoundedSocialBoxComponent {
  @Input() icon?: IconDefinition;
  @Input() title?: string = "";
}
