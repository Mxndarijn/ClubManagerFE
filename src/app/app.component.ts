import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AlertManagerComponent} from "../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {SideBarComponent} from "../SharedModule/components/navigation/side-bar/side-bar.component";
import {NavbarComponent} from "../SharedModule/components/navigation/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomePageComponent, TranslateModule, SideBarComponent, NavbarComponent, AlertManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clubManagerFE';

  constructor(translate: TranslateService) {
    translate.setDefaultLang("nl");
    translate.use("nl")
  }


}
