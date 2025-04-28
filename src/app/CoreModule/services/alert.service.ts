import {EventEmitter, Injectable} from '@angular/core';
import {AlertInfo} from "../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../SharedModule/components/alerts/alert-info/alert-info.component";


@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public NewAlertEvent: EventEmitter<AlertInfo> = new EventEmitter();

  constructor() {
  }

  public showAlert(alert: AlertInfo) {
    this.NewAlertEvent.emit(alert);
  }

  public showPositiveAlert(subTitle: string, title: string = "Succesvol") {
    this.NewAlertEvent.emit({
      title: title,
      subTitle: subTitle,
      icon: AlertIcon.CHECK,
      duration: 4000,
      alertClass: AlertClass.CORRECT_CLASS
    });
  }

  public showNegativeAlert(subTitle: string, title: string = "Fout opgetreden") {
      this.NewAlertEvent.emit({
        title: title,
        subTitle: subTitle,
        icon: AlertIcon.XMARK,
        duration: 4000,
        alertClass: AlertClass.INCORRECT_CLASS
      });
  }
}
