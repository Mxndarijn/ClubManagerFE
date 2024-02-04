import { Component } from '@angular/core';
import { faCaretDown, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent, } from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {AccountIconItemComponent} from "../account-icon-item/account-icon-item.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-account-icon',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    AccountIconItemComponent,
    NgIf
  ],
  templateUrl: './account-icon.component.html',
  styleUrl: './account-icon.component.css'
})
export class AccountIconComponent {
  checkboxChecked = false;
  faCaretDown = faCaretDown
  faXmark = faXmark

  onCheckboxChange() {
  }
}
