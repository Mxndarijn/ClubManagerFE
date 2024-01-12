import {EventEmitter, Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public sidebarVisibilityChangedEvent: EventEmitter<boolean> = new EventEmitter();
  public sidebarReloadEvent: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  public showSidebar() {
    this.sidebarVisibilityChangedEvent.emit(true);
  }

  public hideSidebar() {
    this.sidebarVisibilityChangedEvent.emit(false);
  }

  public refreshSidebar() {
    this.sidebarReloadEvent.emit();
  }

}
