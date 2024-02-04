import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgStyle} from "@angular/common"
import {FormsModule} from "@angular/forms";
import {ThemeControllerComponent} from "../simple-navbar/theme-controller/theme-controller.component";
import {LanguageComponent} from "../simple-navbar/language/language.component";
import {Theme, ThemeService} from "../../services/theme.service";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {User} from "../../../model/user.model";
import {NavigationService} from "../../services/navigation.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert.service";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ThemeControllerComponent, LanguageComponent, TranslateModule, NgStyle, NgClass, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isChecked: boolean;
  isVisible: boolean = false;
  profile: User | undefined;
  title: string = "";
  subTitle: string = "";

  constructor(protected translate: TranslateService,
              private themeService: ThemeService,
              private graphQL: GraphQLCommunication,
              private navigationService: NavigationService,
              private authService: AuthenticationService,
              private router: Router,
              private alertService: AlertService) {
    this.navigationService.NavigationVisibilityChangedEvent.subscribe({
      next: (visible: boolean) => {
        this.isVisible = visible;
      }
    })
    this.navigationService.NavigationReloadEvent.subscribe({
      next: () => {
        this.reload()
      }
    })
    this.navigationService.NavigationTitleChangedEvent.subscribe({
      next: (title: string) => {
        this.title = title;
      }
    })
    this.navigationService.NavigationSubTitleChangedEvent.subscribe({
      next: (subTitle: string) => {
        this.subTitle = subTitle;
      }
    })
    this.reload()
    this.isChecked = themeService.getCurrentTheme() != Theme.LIGHT;

  }
  reload() {
    this.graphQL.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data.data.getMyProfile;
      }
    })
  }

  changeTranslation(language: string) {
    this.translate.use(language);
  }

  onCheckboxChange() {
    this.themeService.setTheme(this.isChecked ? Theme.DARK : Theme.LIGHT);

  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.alertService.showAlert({
      title: "Informatie",
      subTitle: "Je bent uitgelogd.",
      icon: AlertIcon.INFO,
      duration: 4000,
      alertClass: AlertClass.INFO_CLASS
    });
  }
}
