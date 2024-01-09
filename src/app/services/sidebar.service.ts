import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class SidebarService {

  constructor() {
  }

  public showSidebar() {
    var drawer = document.querySelector('.drawer');
    if (drawer) {
      drawer.classList.add('lg:drawer-open');
    }

    var componentDiv = document.querySelector('#component-div')
    if(componentDiv) {
      componentDiv.classList.add('flex', 'flex-row')
    }
  }

  public hideSidebar() {
      var drawer = document.querySelector('.drawer');
      if (drawer) {
        drawer.classList.remove('lg:drawer-open');
      }
      var componentDiv = document.querySelector('#component-div')
      if(componentDiv) {
        componentDiv.classList.remove('flex', 'flex-row')
      }
  }

}
