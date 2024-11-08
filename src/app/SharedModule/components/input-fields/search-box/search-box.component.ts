import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent,
    NgIf,
    TranslateModule
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  @Input()
  placeholder: string = "";
  value: string = "";
  faXMark = faXmark;
  faMagnifyingGlass = faMagnifyingGlass;

  @Output() SearchEvent = new EventEmitter<string>

  clearFilter() {
    this.value = "";
    this.SearchEvent.emit(this.value);
  }
}
