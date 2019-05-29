import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the component destroyed
//social login
/*import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';*/


//import services

//shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//modules core services
import { UserAuthService, TitleService, CognitoUserService } from '../../../core/_services'

import { environment } from '../../../../environments/environment'

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild("otpSection") otpSection: ElementRef;

  title: string = 'Seller Login';
  breadcrumbs: any[] = [{ page: 'Home', link: '' }, { page: 'Login', link: '' }]
  loginForm: FormGroup;
  loginOTPForm: FormGroup;
  submitted: boolean = false;
  showOtpForm: boolean = false;
  otpFormsubmitted: boolean = false;

  constructor( /*private authService: AuthService,*/ private route: ActivatedRoute, private cognitoUserService: CognitoUserService, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private router: Router, private titleService: TitleService, private toastr: ToastrManager) {

    this.sellerLoginForm()
    this.topVerifyForm();
  }


  ngOnInit() {
    //if seller/dealer loggedin then redirect
    this.userAuthService.checkLoginAndRedirect();

    //setting the page title
    this.titleService.setTitle();
  }

  //social logins methods
  signInWithGoogle(): void {
    //this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithFB(): void {
    //this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  private sellerLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      remember_me: [null]
    });
  }

  private topVerifyForm() {
    this.loginOTPForm = this.formBuilder.group({
      code: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9 ]*$')])]
    })
  }

  //on login form submit
  loginByOtp() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.pageLoaderService.pageLoader(true);//show loader
    this.pageLoaderService.setLoaderText('Checking authorisation');//setting loader text

    this.cognitoUserService.login(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          console.log('response', response);
          this.pageLoaderService.pageLoader(false); //hide page loader
          this.showOtpForm = response.mfaRequired;
          this.pageLoaderService.pageLoader(false);//hide page loader
          $(this.otpSection.nativeElement).modal({ backdrop: 'static', keyboard: false, show: response.mfaRequired });
          this.toastr.successToastr(environment.MESSAGES.OTP_RESEND, 'Success!'); //showing success toaster          

        },
        error => {
          this.pageLoaderService.pageLoader(false);//hide page loader      
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }

  resendOTP() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.pageLoaderService.pageLoader(true);//show loader
    this.pageLoaderService.setLoaderText('Checking authorisation');//setting loader text

    this.cognitoUserService.login(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          //console.log('response',response);
          this.pageLoaderService.pageLoader(false); //hide page loader
          this.showOtpForm = response.mfaRequired;
          this.pageLoaderService.pageLoader(false);//hide page loader

          this.toastr.successToastr(environment.MESSAGES.OTP_RESEND, 'Success!'); //showing success toaster          

        },
        error => {
          this.pageLoaderService.pageLoader(false);//hide page loader      
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }

  //call on OTP form submit
  public onSubmitOtp() {
    this.otpFormsubmitted = true;

    // stop here if form is invalid
    if (this.loginOTPForm.invalid) {
      return;
    }

    //confirm seller OTP code
    this.cognitoUserService.confirmLoginOtp(this.loginOTPForm)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {

          localStorage.setItem('aws-loggedinUser', JSON.stringify(response))
          this.pageLoaderService.pageLoader(false);//hide page loader

          /* Hide OTP Form */
          this.showOtpForm = false;
          $(this.otpSection.nativeElement).modal('hide');
          /*
          saving aws response to localstorage
          */
          // this.localLogin();//our local login function




        },
        error => {
          console.log('error otp');
          this.loginOTPForm.reset();
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }

  //check login at our local system
  onSubmit() {
    if (this.loginForm.invalid) {
      return
    }
    this.userAuthService.sellerLogin(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {

          if(response.body.is_verified == false) {
            this.router.navigate(['/seller/account-verify/' + response.body._id]);
          }
          // } else if (response.body.is_multifactor_authorized) {
          //   this.loginByOtp();
          // }

          else {

            this.toastr.successToastr(environment.MESSAGES.LOGIN_SUCCESS, 'Success!');//showing success toaster message
            console.log('x-auth-token:' + response.headers.get('x-auth-token'))
            //save to local storage
            localStorage.setItem('loggedinUser', JSON.stringify(response.body))
            localStorage.setItem('loggedinUserId', response.body._id)
            localStorage.setItem('loggedinSellerUser', JSON.stringify(true))
            localStorage.setItem('x-auth-token', response.headers.get('x-auth-token'))

            this.userAuthService.isLoggedIn(true, 'Seller');//trigger loggedin observable         
            this.router.navigate(['/seller/home']);
          }

        },
        error => {
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }



  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}
