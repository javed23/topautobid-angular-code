import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { SocialLoginModule } from 'angularx-social-login';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask'
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination'; 

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
import { ListingComponent as CarsGridListComponent } from './cars/grid-list-view/listing.component';
import { ListComponent as CarsTableComponent } from './cars/table-view/list.component';
import { CarBidsComponent } from './cars/car-bids/car-bids.component';
import { FiltersComponent } from './cars/filters/filters.component';
import { CarViewComponent as CarDetailComponent} from './cars/car-detail-popup/car-view.component';
import { CarDetailPageComponent } from './cars/car-detail-page/car-detail-page.component';



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
    CarsTableComponent,
    CarDetailComponent,
    CarBidsComponent,
    FiltersComponent,
    CarsGridListComponent,
    CarDetailPageComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SellerRoutingModule,
    SocialLoginModule,
    SharedModule,
    NgbModule,
    DropzoneModule,
    NgxMaskModule.forRoot(),
    NgScrollbarModule,
    NgxDatatableModule,
    NgxPaginationModule
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
