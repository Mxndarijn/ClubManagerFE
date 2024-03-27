// custom-button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
})
export class ConfirmButtonComponent {
  @Input() label: string = '';
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
}
