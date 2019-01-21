import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

//social login
/*import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';*/


//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../shared/_services'

  //modules core services
  import { UserAuthService, TitleService } from '../../../core/_services'

import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("contentSection") contentSection: ElementRef;
  title: string = 'Dealer Login';
  breadcrumbs: any[] = [{ page: 'Home', link: '' }, { page: 'Login', link: '' }]
  loginForm: FormGroup;
  submitted: boolean = false;
  loginSubscription: Subscription;

  constructor( /*private authService: AuthService,*/ private titleService: TitleService, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      remember_me: [null],
      model: ['Dealer']
    });

  }


  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.titleService.setTitle()
  }

  //social logins methods
  signInWithGoogle(): void {
    //this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithFB(): void {
    //this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.pageLoaderService.pageLoader(true);
    this.pageLoaderService.setLoaderText('Checking authorisation');//setting loader text
    this.loginSubscription = this.userAuthService.checkLogin(this.loginForm.value)
      .subscribe(
        (response) => {
          this.pageLoaderService.setLoaderText('Authorised...');//setting loader text
          this.pageLoaderService.setLoaderText('Redirecting...');//setting loader text
          this.pageLoaderService.pageLoader(false);
          if (response) {

            //save to local storage
            localStorage.setItem('loggedinUser', JSON.stringify(response.body))
            localStorage.setItem('loggedinUserId', response.body._id)
            localStorage.setItem('loggedinDealerUser', JSON.stringify(true))
            localStorage.setItem('x-auth-token', response.headers.get('x-auth-token'))
            this.userAuthService.isLoggedIn(true, 'Dealer');
            this.router.navigate(['/dealer/home']);
          }
        },
        error => {
          this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
          this.pageLoaderService.pageLoader(false);
          this.alertService.setAlert('error', error);

        });
  }

  //destroy all subscribers
  ngOnDestroy() {
    //this.loginSubscription.unsubscribe();
  }

}
