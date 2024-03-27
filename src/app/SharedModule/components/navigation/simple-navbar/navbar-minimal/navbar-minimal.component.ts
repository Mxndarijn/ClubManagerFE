import { Component } from '@angular/core';
import {ThemeControllerComponent} from "../theme-controller/theme-controller.component";
import {LanguageComponent} from "../language/language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgStyle} from "@angular/common"
import {FormsModule} from "@angular/forms";
import {Theme, ThemeService} from "../../../../../CoreModule/services/theme.service";

@Component({
  selector: 'app-navbar-minimal',
  standalone: true,
  imports: [ThemeControllerComponent, LanguageComponent, TranslateModule, NgStyle, NgClass, FormsModule],
  templateUrl: './navbar-minimal.component.html',
  styleUrl: './navbar-minimal.component.css'
})
export class NavbarMinimalComponent {
  isChecked: boolean;

  constructor(protected translate: TranslateService,
              private themeService: ThemeService) {
    this.isChecked = themeService.getCurrentTheme() != Theme.LIGHT;

  }

  changeTranslation(language: string) {
    this.translate.use(language);
  }

  onCheckboxChange() {
    this.themeService.setTheme(this.isChecked ? Theme.DARK : Theme.LIGHT);

  }
}
