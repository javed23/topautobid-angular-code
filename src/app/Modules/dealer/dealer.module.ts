import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';


//import social login modules
  import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
  import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
  //import microsoft module
  import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';

//import enviorment file
import { environment } from '../../../environments/environment';
//import dealer routing 
import { DealerRoutingModule } from './dealer-routing.module';
//import shared module
import { SharedModule } from '../../core/shared.module';

//import components
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component'
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';



//facebook, google authentication configuration
/*const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
 
const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
 
*/

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.SOCIAL_LOGINS.GOOGLE.GOOGLE_0AUTH_CLIENT_ID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.SOCIAL_LOGINS.FACEBOOK.FACEBOOK_APP_ID)
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [LoginComponent, HomeComponent, SignupComponent, ProfileComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    DealerRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    NgbModule,
    ArchwizardModule,
  ],
  providers: [
    AdalService,
    AdalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdalInterceptor, multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
})
export class DealerModule { }
