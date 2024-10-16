import {Modal, ModalChange, ModalService, ModalStatus} from "../../CoreModule/services/modal.service";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../CoreModule/services/alert.service";
import {EventEmitter, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

export class DefaultSubscriptionDestroy {
  public subscriptions: Subscription[] = []

  // ngOnDestroy(): void {
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  // }


}
