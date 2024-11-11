import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TranslateModule} from "@ngx-translate/core";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {NgClass, NgIf} from "@angular/common";



export enum ButtonClass {
  ACCENT_CLASS,
  SUCCESS_CLASS,
  ERROR_CLASS,
  WARNING_CLASS
}

export enum ButtonSize {
  BTN_SM,
  BTN_MD,
  BTN_LG,
}
export const cssClassMap = {
  [ButtonClass.ACCENT_CLASS]: ['border-accent', 'text-accent', 'hover:border-accent'],
  [ButtonClass.SUCCESS_CLASS]: ['border-success', 'text-success', 'hover:border-success'],
  [ButtonClass.ERROR_CLASS]: ['border-error', 'text-error', 'hover:border-error'],
  [ButtonClass.WARNING_CLASS]: ['border-warning', 'text-warning', 'hover:border-warning']
};

export const cssButtonSizeClassMap = {
  [ButtonSize.BTN_SM]: ['btn-sm'],
  [ButtonSize.BTN_MD]: ['btn-md'],
  [ButtonSize.BTN_LG]: ['btn-lg'],
};

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [
    FaIconComponent,
    TranslateModule,
    NgIf,
    NgClass
  ],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css'
})
export class CustomButton {

  protected readonly Modal = Modal;
  @Input() icon?: IconDefinition;
  @Output() onClick = new EventEmitter();
  @Input() buttonClass: ButtonClass = ButtonClass.ACCENT_CLASS;
  @Input() labelText: string = '';
  @Input() buttonSize: ButtonSize = ButtonSize.BTN_MD
  @Input() disabledStatus: boolean = false;


  protected readonly cssClassMap = cssClassMap;
  protected readonly cssButtonSizeClassMap = cssButtonSizeClassMap;

  getCSSClasses() {
    return [
          ...this.cssClassMap[this.buttonClass],
          ...this.cssButtonSizeClassMap[this.buttonSize]
        ];
  }
}
