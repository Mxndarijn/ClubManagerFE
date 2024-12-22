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
import {SelectMultipleUsersDatasource} from "./select-multiple-users-datasource";

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
export class SelectMultipleUsersModal extends DefaultModalInformation implements OnInit {
  protected users: UserAssociation[] = [];
  @Input() dataSource!: SelectMultipleUsersDatasource
  private latestSearchParam: string = "";

  filteredUserAssociations: UserAssociation[] = [];
  protected checkboxMap: Map<UserAssociation, boolean> = new Map;

  constructor(
  protected modalService: ModalService,


) {
  super(Modal.SELECT_MULTIPLE_USERS, modalService);
}
  ngOnInit(): void {
    this.users = []
    this.dataSource.loadUsers().then(users => {
      this.users.push(...users.filter(newUser => !this.users.some(existingUser => existingUser.user.id === newUser.user.id)));
      this.filterUsers()
    })
  }

  searchUser(searchValue: string) {
    this.latestSearchParam = searchValue
    this.dataSource.searchUsers(searchValue).then(users => {
      this.users.push(...users.filter(newUser => !this.users.some(existingUser => existingUser.user.id === newUser.user.id)));
      this.filterUsers()
    })
  }

  filterUsers() {
    if(this.latestSearchParam.length > 0) {
      this.filteredUserAssociations = this.users.filter(userAssociation => userAssociation.user.fullName.includes(this.latestSearchParam) || userAssociation.user.email.includes(this.latestSearchParam))

      const nonFilteredUsers = this.users.filter(user =>
        !this.filteredUserAssociations.some(filteredUser => filteredUser.user.id === user.user.id)
      );
      nonFilteredUsers.forEach(userAssociation => {
        this.checkboxMap.set(userAssociation, false);
      })
    } else {
      this.filteredUserAssociations = [...this.users]
    }
  }

  configChoices() {
    const selectedUsers = Array.from(this.checkboxMap.entries())
      .filter(([userAssociation, isSelected]) => isSelected)
      .map(([userAssociation, isSelected]) => userAssociation);
    this.dataSource.onSelect(selectedUsers)
    this.hideModal()
  }
}
