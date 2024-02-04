import {EventEmitter, Injectable} from '@angular/core';
import {AlertInfo} from "../alerts/alert-manager/alert-manager.component";


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

}
