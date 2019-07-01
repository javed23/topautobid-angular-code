import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';


//importing root routing configuration file
import { AppRoutingModule } from './app-routing.module';

//importing root component
import { AppComponent } from './app.component';

//importing core 
//components
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

//importing shared 
//components
import { AlertComponent } from './shared/components/alert/alert.component';
import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
//services 
import { AlertService, PageLoaderService } from './shared/_services'

//import core services
import { UserAuthService,SellerService, TitleService, CommonUtilsService, CarService,DealerService, DealershipService } from './core/_services';

//import shared module
import { SharedModule } from './core/shared.module';




//importing intercepters
import { ApiIntercepter } from './core/intercepters/api.intercepter';
import { TokenInterceptor } from './core/intercepters/token.interceptor';
import { HttpErrorInterceptor } from './core/intercepters/http-error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    PageLoaderComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    AlertService,
    PageLoaderService,
    UserAuthService,
    CommonUtilsService,
    CarService,
    DealershipService,
    DealerService,
    TitleService,
    SellerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

