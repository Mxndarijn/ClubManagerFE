import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {AlertClass, AlertIcon, AlertInfoComponent} from "../alert-info/alert-info.component";
import {AlertService} from "../../../../app/CoreModule/services/alert.service";

@Component({
  selector: 'app-alert-manager',
  standalone: true,
  imports: [
    AlertInfoComponent
  ],
  templateUrl: './alert-manager.component.html',
  styleUrl: './alert-manager.component.css'
})
export class AlertManagerComponent {
  @ViewChild('alertComponentContainer', { read: ViewContainerRef }) container!: ViewContainerRef;


  constructor(
    private alertService: AlertService
  ) {
    alertService.NewAlertEvent.subscribe({
      next: (alert: AlertInfo) => {
        this.showAlert(alert);
      }
    })
  }


  public showAlert(alertInfo: AlertInfo) {
    const componentRef = this.container.createComponent(AlertInfoComponent);
    componentRef.instance.alertIcon = alertInfo.icon;
    componentRef.instance.alertTitle = alertInfo.title;
    componentRef.instance.alertSubtitle = alertInfo.subTitle;
    componentRef.instance.alertClass = alertInfo.alertClass;

    setTimeout(() => {
      componentRef.destroy();
    }, alertInfo.duration);
  }

  protected readonly AlertIcon = AlertIcon;
}
export interface AlertInfo {
  title: string,
  subTitle: string,
  icon: AlertIcon,
  duration: number,
  alertClass: AlertClass,
}
