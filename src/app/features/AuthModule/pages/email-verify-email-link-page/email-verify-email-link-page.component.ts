import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {EmailVerifyEmailLinkPageInterface} from "./email-verify-email-link-interface";
import {
  LeftSideAuthenticationComponent
} from "../../../../SharedModule/components/left-side-authentication/left-side-authentication.component";

@Component({
  selector: 'app-email-verify-email-link-page',
  standalone: true,
  imports: [
    LeftSideAuthenticationComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './email-verify-email-link-page.component.html',
  styleUrl: './email-verify-email-link-page.component.css'
})
export class EmailVerifyEmailLinkPageComponent {
  protected currentState? : EmailVerifyEmailLinkPageInterface
  protected verifyStates: EmailVerifyEmailLinkPageInterface[] = [
    {
      title: 'Geveriefieerd',
      image: '../../assets/verifiedImage.png',
      oneLiner: 'Je account is geverifieerd je kan deze pagina nu sluiten'
    },
    {
      title: 'Niet geverifieerd',
      image: './assets/verifiedImage.png',
      oneLiner: 'Je account is niet geverifieerd, probeer opnieuw'
    },
    {
      title: 'No Code',
      image: './assets/verifiedImage.png',
      oneLiner: 'No verification code entered'
    }
  ]


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
          this.currentState = this.verifyStates[0]
        } else {
          this.currentState = this.verifyStates[1]

        }
      }).catch(e => {
        this.currentState = this.verifyStates[1]

      })
    } else {
      this.currentState = this.verifyStates[2]

    }
  }
}
