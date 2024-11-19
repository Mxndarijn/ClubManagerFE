import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DefaultModalInformation} from "../../models/default-modal-information";
import {Modal, ModalService} from "../../../CoreModule/services/modal.service";
import {Subscription} from "rxjs";
import {UserAssociation} from "../../../CoreModule/models/user-association.model";
import {
  DateTimeSelectorComponent
} from "../../components/input-fields/date-time-selector/date-time-selector.component";
import {ErrorMessageComponent} from "../../components/error-message/error-message.component";
import {FormsModule} from "@angular/forms";
import {
  InputFieldSingleSelectComponent
} from "../../components/input-fields/input-field-single-select/input-field-single-select.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  TextareaModalComponent
} from "../../components/input-fields/textarea-modal/textarea-modal.component";
import {SearchBoxComponent} from "../../components/input-fields/search-box/search-box.component";
import {TranslateModule} from "@ngx-translate/core";
import {
  AutoUpdateSearchBoxComponent
} from "../../components/input-fields/auto-update-search-box/auto-update-search-box.component";

@Component({
  selector: 'app-select-multiple-users-modal',
  standalone: true,
  imports: [
    DateTimeSelectorComponent,
    ErrorMessageComponent,
    FormsModule,
    InputFieldSingleSelectComponent,
    NgIf,
    TextareaModalComponent,
    NgClass,
    SearchBoxComponent,
    TranslateModule,
    AutoUpdateSearchBoxComponent,
    NgForOf
  ],
  templateUrl: './select-multiple-users-modal.html',
  styleUrl: './select-multiple-users-modal.css'
})
export class SelectMultipleUsersModal extends DefaultModalInformation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected users: UserAssociation[] = [];
  private latestSearchParam: string = "";

  @Input() NewUsersEvent!: EventEmitter <UserAssociation[]>;
  @Output() UsersSelected = new EventEmitter<UserAssociation[]>();
  filteredUserAssociations: UserAssociation[] = [];
  protected checkboxMap: Map<UserAssociation, boolean> = new Map;

  constructor(
  protected modalService: ModalService,


) {
  super(Modal.ASSOCIATION_COMPETITION_MEMBERS_OVERVIEW, modalService);
  this.OnModalShowEvent.subscribe({
    next: () => {
    }
  })
}
  ngOnInit(): void {
    this.subscriptions.push(this.NewUsersEvent.subscribe({
      next: (u :UserAssociation[])=> {
        this.users = u;

        this.checkboxMap = new Map<UserAssociation, boolean>();

        this.users.forEach(userAssociation => {
          this.checkboxMap.set(userAssociation, false);
        });
        console.log(this.users);
        this.searchUser(this.latestSearchParam);
      }
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  searchUser(searchValue: string) {
    this.latestSearchParam = searchValue.toLowerCase();
    this.filteredUserAssociations = this.users.filter(userAssociation => {
      console.log(userAssociation)
      return userAssociation.user.fullName.toLowerCase().includes(this.latestSearchParam);
    });


  }

  configChoices() {
    const selectedUsers = Array.from(this.checkboxMap.entries())
      .filter(([userAssociation, isSelected]) => isSelected)
      .map(([userAssociation, isSelected]) => userAssociation);
    this.UsersSelected.emit(selectedUsers)
    this.hideModal()
  }
}
