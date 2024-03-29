import { Component, Input } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-side-bar-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-bar-item.component.html',
  styleUrl: './side-bar-item.component.css'
})
export class SideBarItemComponent {
  @Input()
  item!: SideBarIconStandard
}

export interface SideBarIconStandard {
  name: string,
  link: string,
}
