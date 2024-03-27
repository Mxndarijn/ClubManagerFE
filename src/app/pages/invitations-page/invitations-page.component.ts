import {Component} from '@angular/core';
import {NavigationService} from "../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {map, Observable} from "rxjs";
import {AssociationInvite, AssociationInviteID} from "../../CoreModule/models/association-invite";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../CoreModule/services/modal.service";
import {ConfirmationModalComponent} from "../../modals/confirmation-modal/confirmation-modal.component";
import {DefaultBooleanResponseDTO} from "../../CoreModule/models/dto/default-boolean-response-dto";
import {PermissionService} from "../../CoreModule/services/permission.service";
import {AlertClass, AlertIcon} from "../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../CoreModule/services/alert.service";
import {SearchBoxComponent} from "../../../SharedModule/components/input-fields/search-box/search-box.component";

@Component({
  selector: 'app-invitations-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FaIconComponent,
    NgForOf,
    NgIf,
    SearchBoxComponent,
    UpdateUserModalComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './invitations-page.component.html',
  styleUrl: './invitations-page.component.css'
})
export class InvitationsPageComponent {
  associationInvites: AssociationInvite[] = [];


  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService,
    private permissionService: PermissionService,
    private alertService : AlertService
  ) {
    navigationService.showNavigation();
    this.translate.get('invitationsPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )

    this.graphQLService.getUserInvites().subscribe({
      next: (response) => {
        this.associationInvites = response.data.getMyProfile.invites
      }
    })


  }

  protected formatDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    return this.translate.get("config.language").pipe(
      map(locale => {
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      })
    );
  }

  protected readonly Modal = Modal;

  declineInvite(associationInviteId: AssociationInviteID) {
    this.graphQLService.rejectAssociationInvite(associationInviteId)
      .subscribe({
        next: (response) => {
          const dto : DefaultBooleanResponseDTO = response.data.rejectAssociationInvite
          if(dto.success) {
            this.associationInvites = this.associationInvites.filter(invite => invite.id !== associationInviteId);
            this.navigationService.refreshNavigation();
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "Je hebt de uitnodiging afgewezen.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
          } else {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Probeer het later opnieuw.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }
        },
        error: (e) => {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Probeer het later opnieuw.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      })
  }
  acceptInvite(associationInviteId: AssociationInviteID) {
    this.graphQLService.acceptAssociationInvite(associationInviteId)
      .subscribe({
        next: (response) => {
          const dto : DefaultBooleanResponseDTO = response.data.acceptAssociationInvite
          if(dto.success) {
            this.associationInvites = this.associationInvites.filter(invite => invite.id !== associationInviteId);
            this.permissionService.refreshPermissions();
            this.navigationService.refreshNavigation();
            this.alertService.showAlert({
              title: "Succesvol",
              subTitle: "Je hebt de uitnodiging geaccepteert.",
              icon: AlertIcon.CHECK,
              duration: 4000,
              alertClass: AlertClass.CORRECT_CLASS
            });
          } else {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Probeer het later opnieuw.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }
        },
        error: (e) => {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Probeer het later opnieuw.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      })
  }
}
