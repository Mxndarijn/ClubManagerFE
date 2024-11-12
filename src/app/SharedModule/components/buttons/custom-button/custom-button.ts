import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TranslateModule} from "@ngx-translate/core";
import {Modal} from "../../../../CoreModule/services/modal.service";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {NgClass, NgIf} from "@angular/common";



export enum ButtonClass {
  ACCENT_CLASS,
  SUCCESS_CLASS,
  ERROR_CLASS,
  WARNING_CLASS,
  LOGIN_CLASS
}

export enum ButtonSize {
  BTN_SM,
  BTN_MD,
  BTN_LG,
}
export const cssClassMap = {
  [ButtonClass.ACCENT_CLASS]: ['border-accent','bg-base-300', 'text-accent', 'hover:border-accent'],
  [ButtonClass.SUCCESS_CLASS]: ['border-success', 'bg-base-300',  'text-success', 'hover:border-success'],
  [ButtonClass.ERROR_CLASS]: ['border-error', 'bg-base-300', 'text-error', 'hover:border-error'],
  [ButtonClass.WARNING_CLASS]: ['border-warning', 'bg-base-300', 'text-warning', 'hover:border-warning'],
  [ButtonClass.LOGIN_CLASS]: ['bg-accent', 'text-base-content', 'border-none' ]
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
export class CustomButton implements OnInit {
  ngOnInit(): void {
    this.additionalClassesList = this.additionalClasses.split(' ')
  }


  protected readonly Modal = Modal;
  @Input() icon?: IconDefinition;
  @Output() onClick = new EventEmitter();
  @Input() buttonClass: ButtonClass = ButtonClass.ACCENT_CLASS;
  @Input() labelText: string = '';
  @Input() buttonSize: ButtonSize = ButtonSize.BTN_MD
  @Input() disabledStatus: boolean = false;
  @Input() additionalClasses: string = '';

  additionalClassesList: string[] = []

  protected readonly cssClassMap = cssClassMap;
  protected readonly cssButtonSizeClassMap = cssButtonSizeClassMap;


  getCSSClasses() {
    return [
          ...this.cssClassMap[this.buttonClass],
          ...this.cssButtonSizeClassMap[this.buttonSize],
          ...this.additionalClassesList
    ];
  }
}
