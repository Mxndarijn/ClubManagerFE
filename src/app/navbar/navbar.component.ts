import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgStyle} from "@angular/common"
import {FormsModule} from "@angular/forms";
import {ThemeControllerComponent} from "../navigation/simple-navbar/theme-controller/theme-controller.component";
import {LanguageComponent} from "../navigation/simple-navbar/language/language.component";
import {Theme, ThemeService} from "../services/theme.service";
import {GraphQLCommunication} from "../services/graphql-communication.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeControllerComponent, LanguageComponent, TranslateModule, NgStyle, NgClass, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isChecked: boolean;
  profile: any;

  constructor(protected translate: TranslateService,
              private themeService: ThemeService,
              private graphQL: GraphQLCommunication) {
    this.graphQL.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data.data.getMyProfile;
      console.log(this.profile.image.encoded)
      }
    })
    this.isChecked = themeService.getCurrentTheme() != Theme.LIGHT;

  }

  changeTranslation(language: string) {
    this.translate.use(language);
  }

  onCheckboxChange() {
    this.themeService.setTheme(this.isChecked ? Theme.DARK : Theme.LIGHT);

  }
}
