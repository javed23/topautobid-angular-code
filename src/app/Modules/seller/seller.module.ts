import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask'
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArchwizardModule } from 'angular-archwizard';

//import enviorment file
import { environment } from '../../../environments/environment';

//importing components
import { SellerRoutingModule } from './seller-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../../core/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//cars management components
import { ListComponent as CarsListComponent } from './cars/list/list.component';
import { CarViewComponent } from './cars/car-view/car-view.component';
import { CarBidsComponent } from './cars/car-bids/car-bids.component';
import { AddCarComponent } from './cars/addcar/addcar.component';


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
    SignupComponent, 
    HomeComponent, 
    ProfileComponent, 
    ForgotPasswordComponent,
    CarsListComponent,
    CarViewComponent,
    CarBidsComponent,
    AddCarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    SocialLoginModule,
    SharedModule,
    NgbModule,
    ArchwizardModule,
    DropzoneModule,
    NgxMaskModule.forRoot(),
    NgScrollbarModule,
    NgxDatatableModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
})
export class SellerModule { }
