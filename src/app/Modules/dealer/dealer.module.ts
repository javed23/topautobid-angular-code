import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import {
  DropzoneModule, DropzoneConfigInterface,
  DROPZONE_CONFIG
} from 'ngx-dropzone-wrapper';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxGalleryModule } from 'ngx-gallery';


//import social login modules
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
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
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


//dealerships management components
import { ListComponent as DealershipsListComponent } from './dealerships/table-view/list.component';
import { ContactViewComponent } from './dealerships/contact-view/contact-view.component';
import { DealershipViewComponent } from './dealerships/dealership-view/dealership-view.component';
import { CreateDealershipComponent } from './dealerships/create-dealership/create-dealership.component';
import { CreateContactComponent } from './dealerships/create-contact/create-contact.component';
import { PurchasesListComponent } from './purchases/purchases-list/purchases-list.component';

//cars management components
import { ListingComponent as CarsGridListComponent } from './cars/grid-list-view/listing.component';
import { CarDetailPageComponent } from './cars/car-detail-page/car-detail-page.component';
import { ContactRequestComponent } from './cars/contact-request/contact-request.component';



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

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  acceptedFiles: '.jpg, .png, .jpeg',
  createImageThumbnails: true
};

export function provideConfig() {
  return config;
}

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


@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    DealershipsListComponent,
    ContactViewComponent,
    DealershipViewComponent,
    CreateDealershipComponent,
    CreateContactComponent,
    PurchasesListComponent,
    CarsGridListComponent,
    CarDetailPageComponent
  ]
  ,
 imports: [
    CarDetailPageComponent,
    ContactRequestComponent
  ,
    CommonModule,
    DealerRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule, 
    SharedModule,
    DropzoneModule,
    NgxMaskModule.forRoot(),
    NgbModule,
    ArchwizardModule,
    NgScrollbarModule,
    NgxDatatableModule,
    NgxPaginationModule,
    NgxGalleryModule

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
