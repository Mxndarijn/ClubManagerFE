import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-account-icon-item',
  standalone: true,
  imports: [],
  templateUrl: './account-icon-item.component.html',
  styleUrl: './account-icon-item.component.css'
})
export class AccountIconItemComponent {
  @Input() informationText: string = '';

}
