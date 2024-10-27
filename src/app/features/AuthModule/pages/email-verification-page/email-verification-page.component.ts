import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import { TranslateModule } from "@ngx-translate/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import { GraphQLCommunication } from "../../../../CoreModule/services/graphql-communication.service";
import {
  ConfirmButtonComponent
} from "../../../../SharedModule/components/buttons/confirm-button/confirm-button.component";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";

@Component({
  selector: 'app-email-verification-page',
  standalone: true,
  imports: [
    DefaultInputFieldComponent,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    ConfirmButtonComponent
  ],
  templateUrl: './email-verification-page.component.html',
  styleUrls: ['./email-verification-page.component.css']
})
export class EmailVerificationPageComponent implements OnInit, OnDestroy {

  resetMailForm: FormGroup<{
    email: FormControl<string | null>
  }> = new FormGroup({
    email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email]))
  });
  private intervalId?: ReturnType<typeof setInterval>;
  showPassword = false;
  profileEmail : string = ""

  constructor(
    private graphQL: GraphQLCommunication,
    private auth : AuthenticationService,
    private router: Router,
  ) {
    this.refreshProfileEmail()
  }

  changeEmail() {
    if (this.resetMailForm.valid) {
      const emailValue = this.resetMailForm.controls.email.value!;
      this.graphQL.changeEmailWhileInVerificationProcess(emailValue).then(res => {
        console.log(res)
        if(res.success) {
          this.auth.setToken(res.message);
          this.refreshProfileEmail()
        } else {

        }
        console.log(res)
      })
      // Voeg hier je logica toe voor het wijzigen van de email
    }
  }

  refreshProfileEmail() {
    this.graphQL.getMyProfileEmail().then(result => {
      this.profileEmail = result.email;
    })
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.auth.isLoggedIn().then(result => {
        if(!result) {
          this.router.navigate(['/login']);
        }
      })
      this.auth.isAccountVerified().then(result => {
        if(result) {
          this.router.navigate(['/home']);
        }
      })
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
