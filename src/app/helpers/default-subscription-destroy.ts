import {Modal, ModalChange, ModalService, ModalStatus} from "../services/modal.service";
import {GraphQLCommunication} from "../services/graphql-communication.service";
import {AlertService} from "../services/alert.service";
import {EventEmitter, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

export class DefaultSubscriptionDestroy {
  public subscriptions: Subscription[] = []

  // ngOnDestroy(): void {
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  // }


}
