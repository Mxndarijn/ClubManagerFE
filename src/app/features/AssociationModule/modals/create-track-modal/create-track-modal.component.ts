import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {WeaponType} from '../../../../CoreModule/models/weapon-type.model';
import {Modal, ModalService} from '../../../../CoreModule/services/modal.service';
import {Track} from "../../../../CoreModule/models/track.model";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {CreateTrackResponseDTO} from "../../../../CoreModule/models/dto/create-track-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {
  InputFieldWeaponModalComponent
} from "../../../../SharedModule/components/input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";

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
export class CreateTrackModalComponent extends DefaultModalInformation implements OnInit {
  @Input() rejectButtonText: string = "";
  @Input() acceptButtonText: string = "";
  @Input() currentTrack?: Track;
  @Input() SetCurrentTrack!: EventEmitter<Track>;

  protected createTrackForm: FormGroup<{
    trackTitle: FormControl<string | null>;
    trackDescription: FormControl<string | null>;
    trackWeaponTypes: FormControl<WeaponType[] | null>;
  }>;
  weaponTypeList: WeaponType[] = [];
  private associationID: string;

  @Output() TrackCreatedEvent = new EventEmitter<Track>
  @Output() TrackEditedEvent = new EventEmitter<Track>
  @Output() TrackDeleteEvent = new EventEmitter<Track>


  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication,
    private alertService: AlertService
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

  ngOnInit(): void {
    this.SetCurrentTrack.subscribe({
      next: (track: Track) => {
        this.currentTrack = track;
        const list: WeaponType[] = [];
        this.currentTrack.allowedWeaponTypes.forEach(weaponType => {
          const value = this.weaponTypeList.find(w => w.id === weaponType.id)
          if(value != null) {
            list.push(value);
          }
        })
        this.createTrackForm.controls.trackWeaponTypes.setValue(list);
        this.createTrackForm.controls.trackTitle.setValue(this.currentTrack!.name);
        this.createTrackForm.controls.trackDescription.setValue(this.currentTrack!.description);
      }
    })
    }

  setCurrentTrack() {
    this.currentTrack!.name = this.createTrackForm.controls.trackTitle.value!;
    this.currentTrack!.description = this.createTrackForm.controls.trackDescription.value!;
    this.currentTrack!.allowedWeaponTypes = this.createTrackForm.controls.trackWeaponTypes.value!;
  }

  createTrack() {
    this.setCurrentTrack();
    this.graphQLService.createTrack(this.associationID, this.currentTrack!).subscribe({
      next: (response) => {
        this.hideModal()
        const rDTO = response.data.createTrackForAssociation as CreateTrackResponseDTO;
        if(rDTO.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De baan is succesvol aangemaakt.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
          this.TrackCreatedEvent.emit(rDTO.track);
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het aanmaken van de baan.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });

        }
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een onbekende fout opgetreden bij het aanmaken van de baan.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })
  }

  saveTrack() {
    this.setCurrentTrack();
    this.graphQLService.editTrack(this.associationID, this.currentTrack!).subscribe({
      next: (response) => {
        this.hideModal();
        const rDTO = response.data.editTrackForAssociation as CreateTrackResponseDTO;
        if(rDTO.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De baan is succesvol gewijzigd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
          this.TrackEditedEvent.emit(rDTO.track);
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het opslaan van de baan.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });

        }
      }
    })
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

  containsWeaponTypeInList(weaponType: WeaponType) {
    return this.createTrackForm.controls.trackWeaponTypes.value!.includes(weaponType);

  }
}
