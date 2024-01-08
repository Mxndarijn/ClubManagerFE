import { Component } from '@angular/core';
import {ThemeControllerComponent} from "../theme-controller/theme-controller.component";
import {LanguageComponent} from "../language/language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-navbar-minimal',
  standalone: true,
  imports: [ThemeControllerComponent, LanguageComponent, TranslateModule, NgStyle, NgClass],
  templateUrl: './navbar-minimal.component.html',
  styleUrl: './navbar-minimal.component.css'
})
export class NavbarMinimalComponent {

  constructor(protected translate: TranslateService) {
  }

  changeTranslation(language: string) {
    this.translate.use(language);
  }
}
