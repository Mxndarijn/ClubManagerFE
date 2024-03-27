import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {TokenInterceptor} from "./CoreModule/interceptors/token.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json")
}

export const provideTranslation = () => ({
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
});
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    importProvidersFrom([HttpClientModule,
        TranslateModule.forRoot(provideTranslation()),
    ]), provideAnimations()],
};

