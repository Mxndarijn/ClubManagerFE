import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-association-name',
  standalone: true,
  imports: [],
  templateUrl: './association-name.component.html',
  styleUrl: './association-name.component.css'
})
export class AssociationNameComponent {
  @Input() textLabel: string = '';

}
