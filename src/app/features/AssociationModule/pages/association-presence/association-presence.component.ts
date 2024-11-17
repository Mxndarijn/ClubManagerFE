import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {BarcodeFormat} from "@zxing/library";
import {NgForOf, NgIf} from "@angular/common";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {
  AssociationPresenceCreateComponent
} from "../../modals/association-presence-create/association-presence-create.component";

@Component({
  selector: 'app-association-presence',
  standalone: true,
  imports: [
    ZXingScannerModule,
    NgIf,
    SearchBoxComponent,
    NgForOf,
    ConfirmationModalComponent,
    AssociationPresenceCreateComponent
  ],
  templateUrl: './association-presence.component.html',
  styleUrl: './association-presence.component.css'
})
export class AssociationPresenceComponent {
  torchEnabled = false;
  torchCompatible = false;
  formats: BarcodeFormat[] = [BarcodeFormat.CODE_39];
  deviceCurrent: MediaDeviceInfo | undefined;
  availableDevices: MediaDeviceInfo[] | undefined;
  deviceSelected: string | undefined;

  hasDevices?: boolean;
  hasPermission?: boolean;

  currentSelected? : UserAssociation

  result : string = ""
  private associationID: string;
  resultList : UserAssociation[] = []


  constructor(
    private route : ActivatedRoute,
    private navigationService: NavigationService,
    private translate : TranslateService,
    private graphQLService: GraphQLCommunication,
    protected modalService: ModalService
  ) {
    this.associationID = route.snapshot.params['associationID'];

    navigationService.showNavigation();
    this.translate.get('associationPresence.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLService.getAssociationName(this.associationID).then(r =>{
      navigationService.setSubTitle(r.name);
    })
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(barCode: string) {
    this.result = barCode
    this.search(this.result)
  }

  onHasPermission(permissionsEnabled: boolean) {
    this.hasPermission = permissionsEnabled;
  }

  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices?.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  async requestPermission() {
    try {
      // Vraag opnieuw toestemming
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.hasPermission = true;
      stream.getTracks().forEach(track => track.stop()); // Stop de camera na controle
    } catch (err) {
      console.error('Camera-toegang is nog steeds geweigerd:', err);
      // alert('Camera-toegang is vereist. Controleer de instellingen van je browser om dit te wijzigen.');
    }
  }

  search(searchValue?: string) {
    if(!searchValue) {
      searchValue = this.result
    }
    console.log(this.result)
    this.graphQLService.getAssociationMembers(this.associationID, 20, undefined, searchValue).then(r =>{
      console.log(r)
      this.resultList = r.users.edges.map((edge: any) => edge.node);
    })


  }

  protected readonly Modal = Modal;

  createPresence(time: string) {
    if(this.currentSelected == null) {
      return
    }
    this.modalService.hideModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION)
    this.graphQLService.createUserPresence(this.associationID, this.currentSelected.user.id, time).then(r => {
      console.log(r)
    })
    console.log(time)
  }

  openConfirm(ua: UserAssociation) {
    this.currentSelected = ua
    this.modalService.showModal(Modal.ASSOCIATION_PRESENCE_CONFIRMATION)
  }
}
