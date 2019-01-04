import { Component, OnInit } from '@angular/core';
import { AbstractControl,  FormBuilder,  FormGroup,  Validators } from '@angular/forms';
//import our installed module
import { AdalService } from 'adal-angular4';
import { TranslateService } from '@ngx-translate/core';

//import facebook, google Auth module
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  private user: SocialUser;
  private loggedIn: boolean;
  
  constructor( private authService: AuthService, private pageLoaderService:PageLoaderService, private translate: TranslateService, private adalService: AdalService, private formBuilder: FormBuilder) { 
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      fileName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
    //this.translate.setDefaultLang('en');
    this.translate.use('en');
    //this.pageLoaderService.pageLoader(true);

  }

  ngOnInit() {
    this.adalService.init(environment.config);
    this.adalService.handleWindowCallback();

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });

    //console.log(this.adalService.userInfo);
  }

  //social logins methods
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }
  
  microsoftLogin(){ 
    this.adalService.login();    
  }

  signOut(): void {
    this.authService.signOut();
  }

}
