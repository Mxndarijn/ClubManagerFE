import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-auto-update-search-box',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './auto-update-search-box.component.html',
  styleUrl: './auto-update-search-box.component.css'
})
export class AutoUpdateSearchBoxComponent {
  @Input()
  placeholder: string = "";
  value: string = "";
  faXMark = faXmark;

  @Output() SearchEvent = new EventEmitter<string>

  clearFilter() {
    this.value = "";
    this.SearchEvent.emit(this.value);
  }
}
