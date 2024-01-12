import {EventEmitter, Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public NavigationVisibilityChangedEvent: EventEmitter<boolean> = new EventEmitter();
  public NavigationTitleChangedEvent: EventEmitter<string> = new EventEmitter();
  public NavigationSubTitleChangedEvent: EventEmitter<string> = new EventEmitter();
  public NavigationReloadEvent: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  public showNavigation() {
    this.NavigationVisibilityChangedEvent.emit(true);
  }

  public hideNavigation() {
    this.NavigationVisibilityChangedEvent.emit(false);
  }

  public setTitle(title: string) {
    this.NavigationTitleChangedEvent.emit(title);
  }

  public setSubTitle(subTitle: string) {
    this.NavigationSubTitleChangedEvent.emit(subTitle);
  }

  public refreshNavigation() {
    this.NavigationReloadEvent.emit();
  }

}
