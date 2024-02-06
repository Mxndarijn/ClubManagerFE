import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../helpers/default-modal-information";
import {
  InputFieldWeaponModalComponent
} from "../../input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {TextareaModalComponent} from "../../input-fields/textarea-modal/textarea-modal.component";
import {ColorPreset} from "../../../model/color-preset.model";
import {Weapon} from "../../../model/weapon.model";
import { WeaponType } from '../../../model/weapon-type.model';
import { Modal, ModalService } from '../../services/modal.service';
import {Track} from "../../../model/track.model";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {list} from "postcss";

@Component({
  selector: 'app-create-track-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    InputFieldWeaponModalComponent,
    TextareaModalComponent,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-track-modal.component.html',
  styleUrl: './create-track-modal.component.css'
})
export class CreateTrackModalComponent extends DefaultModalInformation {
  @Input() rejectButtonText: string = "";
  @Input() acceptButtonText: string = "";
  protected createTrackForm: FormGroup<{
    trackTitle: FormControl<string | null>;
    trackDescription: FormControl<string | null>;
    trackWeaponTypes: FormControl<WeaponType[] | null>;
  }>;
  @Input() currentTrack?: Track;
  weaponTypeList: WeaponType[] = [];
  private associationID: string;


  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication
  ) {
    super(Modal.ASSOCIATION_CONFIGURE_TRACK_CREATE_TRACK, modalService);
    this.associationID = route.snapshot.params['associationID'];

    // @ts-ignore
    this.createTrackForm = new FormGroup({
      trackTitle: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      trackDescription: new FormControl(''),
      trackWeaponTypes: new FormControl([], Validators.required),
    });

    this.graphQLService.getAllWeaponTypes(this.associationID).subscribe({
      next: (response) => {
        this.weaponTypeList = response.data.getAllWeaponTypes
      }
    })
  }


  createTrack() {

  }

  deleteTrack() {

  }

  saveTrack() {

  }

  onWeaponTypeChange(weaponType: WeaponType, event: any) {
    const checked = event.target.checked;
    if(checked) {
      const list = this.createTrackForm.controls.trackWeaponTypes.value!;
      list.push(weaponType)
      this.createTrackForm.controls.trackWeaponTypes.setValue(list);
    } else {
      this.createTrackForm.controls.trackWeaponTypes.setValue(this.createTrackForm.controls.trackWeaponTypes.value!.filter(type => type !== weaponType));
    }

  }
}

