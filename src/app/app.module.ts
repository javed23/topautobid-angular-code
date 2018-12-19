import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';


//importing root routing configuration file
import { AppRoutingModule } from './app-routing.module';

//importing root component
import { AppComponent } from './app.component';

//importing core 
  //components
  import { HeaderComponent } from './core/header/header.component';
  import { FooterComponent } from './core/footer/footer.component';
  import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

//importing shared 
  //components
  import { AlertComponent } from './shared/components/alert/alert.component';
  import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
  //services
  import { AlertService, PageLoaderService } from './shared/_services'




//importing guards
import { AuthGuardService } from './core/guards/auth-guard.service';




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
  ],
  providers: [AlertService,PageLoaderService,AuthGuardService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

