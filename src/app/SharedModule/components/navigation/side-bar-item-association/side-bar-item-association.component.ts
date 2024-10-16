import { Component, Input } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {SideBarIconStandard} from "../side-bar-item/side-bar-item.component";

@Component({
  selector: 'app-side-bar-item-association',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-bar-item-association.component.html',
  styleUrl: './side-bar-item-association.component.css'
})
export class SideBarItemAssociationComponent {
  @Input()
  item!: SideBarIconAssociation
  @Input()
  association!: any

  protected getRouterLink() {
    return ['/association', this.association.id, this.item.link];
  }
}

export interface SideBarIconAssociation extends SideBarIconStandard {
  permission: string
}

