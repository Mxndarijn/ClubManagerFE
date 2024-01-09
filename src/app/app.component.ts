import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { LoginPageComponent } from './login-page/login-page.component';
// import { RegisterPageComponent } from './register-page/register-page.component';
import {HomePageComponent} from "./home-page/home-page.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SideBarComponent} from "./side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomePageComponent, TranslateModule, SideBarComponent],
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
