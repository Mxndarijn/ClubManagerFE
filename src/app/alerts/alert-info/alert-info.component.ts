import {Component, Input} from '@angular/core';
import {faCheckCircle, faXmarkCircle, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
export enum AlertIcon {
  INFO,
  CHECK,
  XMARK
}

export enum AlertClass {
  INFO_CLASS,
  CORRECT_CLASS,
  INCORRECT_CLASS

}
export const ALERT_CLASSES = {
  [AlertClass.INFO_CLASS]: "border-accent",
  [AlertClass.CORRECT_CLASS]: "border-success",
  [AlertClass.INCORRECT_CLASS]: "border-error",

};

export const ALERT_ICONS = {
  [AlertIcon.INFO]: faInfoCircle,
  [AlertIcon.CHECK]: faCheckCircle,
  [AlertIcon.XMARK]: faXmarkCircle
};

@Component({
  selector: 'app-alert-info',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './alert-info.component.html',
  styleUrl: './alert-info.component.css'
})
export class AlertInfoComponent {
  @Input()
  alertClass: AlertClass = AlertClass.INFO_CLASS;
  @Input()
  alertTitle: string = "";
  @Input()
  alertSubtitle: string = "";
  @Input()
  alertIcon: AlertIcon = AlertIcon.INFO;
  protected readonly ALERT_CLASSES = ALERT_CLASSES;
  protected readonly AlertClass = AlertClass;
  protected readonly ALERT_ICONS = ALERT_ICONS;
}
