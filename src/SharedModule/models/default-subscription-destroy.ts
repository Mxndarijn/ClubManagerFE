import {Modal, ModalChange, ModalService, ModalStatus} from "../../app/CoreModule/services/modal.service";
import {GraphQLCommunication} from "../../app/CoreModule/services/graphql-communication.service";
import {AlertService} from "../../app/CoreModule/services/alert.service";
import {EventEmitter, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

export class DefaultSubscriptionDestroy {
  public subscriptions: Subscription[] = []

  // ngOnDestroy(): void {
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  // }


}
