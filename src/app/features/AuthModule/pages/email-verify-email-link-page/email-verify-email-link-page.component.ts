import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";

@Component({
  selector: 'app-email-verify-email-link-page',
  standalone: true,
  imports: [],
  templateUrl: './email-verify-email-link-page.component.html',
  styleUrl: './email-verify-email-link-page.component.css'
})
export class EmailVerifyEmailLinkPageComponent {
  protected message : string = "waiting..."


  constructor(
    private route: ActivatedRoute,
    private graphQL : GraphQLCommunication
  )
  {
    const verificationCode = this.route.snapshot.paramMap.get('verificationCode');
    console.log('Verification Code:', verificationCode);
    if(verificationCode != undefined) {
      this.graphQL.verifyEmail(verificationCode).then((res: DefaultBooleanResponseDTO) => {
        if(res != null && res.success) {
          this.message = "verified"
        } else {
          this.message = "could not verify"
        }
      }).catch(e => {
        this.message = "could not verify (error)"
      })
    } else {
      this.message = "no verification code entered"
    }
  }
}
