import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
//modules core services
import { UserAuthService, TitleService, CognitoUserService } from '../../../core/_services';

import { environment } from '../../../../environments/environment'

//shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

import * as _ from 'lodash';
import { SUCCESS } from 'dropzone';
declare var $;
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  authToken: string;
  ismultifactorVerification: boolean = false;
  multifactorOption: string = 'phone';
  alreadyVerified: boolean;
  is_multifactor_authorized: boolean;
  otpFormsubmitted: boolean;
  user: any = {};
  //forms
  otpVerificationForm: FormGroup;



  title: string = 'Dealer Email Verification';
  constructor(private router:Router,private pageLoaderService:PageLoaderService,private cognitoUserService: CognitoUserService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private authService: UserAuthService, private toasterService: ToastrManager) { }
  @ViewChild("otpSection") otpSection: ElementRef;

  ngOnInit() {
  
    this.activatedRoute.params.subscribe((params) => {
      this.authToken = params['token'];
      //verify user usig the token if it is valid or not
      this.authService.verifyDealerEmail({ token: this.authToken })
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          if ('alreadyVerified' in response) {
            console.log('hiiiiiiiiiiiiiiiiii')
            this.alreadyVerified = true;
            this.user = response.dealer;
          }
          else {
            this.alreadyVerified = false;
            this.user = response;
          }

        }, (error) => {
         
          this.toasterService.errorToastr(error, 'Oops!',{toastTimeout:2000});//showing error toaster message
          this.router.navigate(['/seller/login'])
        })
    })

    //initilize otp verification form
    this.otpVerifyForm();

  }




  private otpVerifyForm() {
    this.otpVerificationForm = this.formBuilder.group({
      ConfirmationCode: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9 ]*$')])],
      ClientId: [environment.AWS.COGNITO.ClientId],
      Username: [null]
    })
  }





  /**
   * 
   * on check of multifactor verification
   */
  onSubmit() {
    let userSignup = {};
    if (this.multifactorOption == 'phone')
      userSignup = _.pick(this.user, ['username', 'phones', 'name', 'cipher'])

    else if (this.multifactorOption == 'email')
      userSignup = _.pick(this.user, ['username', 'emails', 'name', 'cipher'])



      this.pageLoaderService.pageLoader(true);//start showing page loader
      this.pageLoaderService.setLoaderText('Regestring seller...');//setting loader text
      console.log('the user is '+userSignup)
      //saving the seller at aws user pool
    this.cognitoUserService.signup(userSignup)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          console.log('username', response['username'])
          this.showPopup(); //open verification popup
          this.pageLoaderService.pageLoader(false);//hide page loader  

          this.otpVerificationForm.controls['Username'].setValue(response['username']);
          console.log('otpVerificationForm', this.otpVerificationForm.value)
          this.toasterService.successToastr(environment.MESSAGES.VERIFICATION_PENDING, 'Success!');//showing success toaster

        },
        error => {
          this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
          this.pageLoaderService.pageLoader(false);//hide page loader
          this.toasterService.errorToastr(error, 'Oops!');//showing error toaster message

        });

  }






  private deleteDealerFromAWSCognito(u) {
    this.cognitoUserService.deleteUser(u)
      .pipe()
      .subscribe(
        (response) => { },
        error => { });
  }


  /**
   * confirm otp from aws for MFA
   */

  onSubmitOtp() {
    this.otpFormsubmitted = true;
    // stop here if form is invalid
    if (this.otpVerificationForm.invalid) {
      return;
    }
    console.log('onsubmitotp', this.otpVerificationForm.value)
    //confirm seller OTP code
    this.cognitoUserService.confirmSignupOtp(this.otpVerificationForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.setMFA();


        },
        error => {
          console.log('error otp');
          this.otpVerificationForm.controls['ConfirmationCode'].setValue('');
          this.toasterService.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }




  resendOTP() {
    //confirm seller OTP code


    this.cognitoUserService.resendSignupOTP()
      .subscribe(
        (response) => {
          this.toasterService.successToastr(environment.MESSAGES.OTP_RESEND, 'Success!'); //showing success toaster          


        },
        error => {
          console.log('error otp');
          //this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
          this.toasterService.errorToastr(environment.MESSAGES.OTP_FAILED_RESEND, 'Oops!');//showing error toaster message
        });
  }



  private setMFA() {
    this.pageLoaderService.pageLoader(true);//start showing page loader
    this.pageLoaderService.setLoaderText('Updating  seller MFA...');//setting loader text

    this.authService.setDealerMFA({ userId: this.user._id, multifactorOption: this.multifactorOption }).subscribe((res: any) => {
      this.pageLoaderService.pageLoader(false);//start showing page loader
      this.user.ismultifactorVerification = true;
      this.toasterService.successToastr('successfully updated the MFA!', 'Success!');
     
      this.hidePopup();
      
    }, error => {
      this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.toasterService.successToastr(error, 'Oops!');
    })

  }

  private showPopup() {
    // this.showOtpForm = true;
    $(this.otpSection.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
  }

  // hide POpup
  private hidePopup() {
    $(this.otpSection.nativeElement).modal('hide');
  }

  ngOnDestroy() {

  }
}

