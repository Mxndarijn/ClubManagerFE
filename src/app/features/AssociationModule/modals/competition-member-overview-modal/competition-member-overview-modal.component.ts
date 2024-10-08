import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {Subscription} from "rxjs";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {ErrorMessageComponent} from "../../../../SharedModule/components/error-message/error-message.component";
import {FormsModule} from "@angular/forms";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {
  InputFieldWeaponModalComponent
} from "../../../../SharedModule/components/input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {TranslateModule} from "@ngx-translate/core";
import {
  AutoUpdateSearchBoxComponent
} from "../../../../SharedModule/components/input-fields/auto-update-search-box/auto-update-search-box.component";

@Component({
  selector: 'app-competition-member-overview-modal',
  standalone: true,
  imports: [
    DateTimeSelectorComponent,
    ErrorMessageComponent,
    FormsModule,
    InputFieldSingleSelectComponent,
    InputFieldWeaponModalComponent,
    NgIf,
    TextareaModalComponent,
    NgClass,
    SearchBoxComponent,
    TranslateModule,
    AutoUpdateSearchBoxComponent,
    NgForOf
  ],
  templateUrl: './competition-member-overview-modal.component.html',
  styleUrl: './competition-member-overview-modal.component.css'
})
export class CompetitionMemberOverviewModalComponent extends DefaultModalInformation implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected users: UserAssociation[] = [];
  private latestSearchParam: string = "";

  @Input() NewUsersEvent!: EventEmitter <UserAssociation[]> ;
  filteredUserAssociations: UserAssociation[] = [];

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
}
