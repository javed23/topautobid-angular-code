import { Component, OnInit,  ViewChild, ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
import { Location } from '@angular/common';
//import { TranslateService } from '@ngx-translate/core';
import { AbstractControl,  FormBuilder, FormArray,  FormGroup,  FormControl, Validators } from '@angular/forms';
import { Router} from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {MovingDirection} from 'angular-archwizard';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed


//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//import core services
import { UserAuthService, TitleService, CognitoUserService } from '../../../core/_services'

//import core services
import { CustomValidators } from '../../../core/custom-validators';

import { environment } from '../../../../environments/environment'

//import Lodash
import * as _ from 'lodash';


declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;


export class MyItems {    
  legalcoroporationname: string; 
  dealershipnumber: string; 
  mainaddressline1: string;  
  mainaddressline2: string; 
  state: string; 
  city: string; 
  zip: string; 
  constructor(legalcoroporationname:string, dealershipnumber:string, mainaddressline1:string, mainaddressline2:string, state:string, city:string, zip:string)    
  {    
    this.legalcoroporationname = legalcoroporationname;  
    this.dealershipnumber = dealershipnumber;   
    this.mainaddressline1 = mainaddressline1;
    this.mainaddressline2 = mainaddressline2;
    this.state = state;
    this.city = city;
    this.zip = zip;
  }    
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  // OTP Popup
  @ViewChild("otpSection") otpSection: ElementRef;


  // Array where we are going to do CRUD operations
  dealershipsItems: MyItems[] = new Array();

  // Other variables for CRUD operations
  IsForUpdate: boolean = false;  
  updatedItem;
  dealershipList:any = [];  

  // Redirect To Form
  @ViewChild("contentSection") contentSection: ElementRef;

  title:string = 'Register';
  breadcrumbs:any = [{page:'Home',link:''},{page:'Register',link:''}]

  // TimePicker
  time = {hour: 13, minute: 30, second: 0};
  spinners = true;
  meridian = false;




  // SignUp Form
  signUpFormStep1: FormGroup;
  signUpFormStep2: FormGroup;
  signUpFormStep3: FormGroup;

  step3submitted:boolean = false;
  step2submitted:boolean = false;
  step1submitted:boolean = false;
 

  signupSubscription: Subscription;
  usPhonePattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";


  // two factor Authentication
  showOtpForm: boolean = false;
  otpVerificationForm:FormGroup;
  otpFormsubmitted: boolean = false;
  registeredSellerid:string;

  //define default emails and phones formArrayName 
  step1data = {
    phones: [
      {
        phone: "",
        country_code:"+91",
        default: true
      }
    ],
    emails: [
      {
        email: "",
        default: true
      }
    ]
  }


constructor( private zone:NgZone, private cognitoUserService:CognitoUserService, private location: Location, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private titleService: TitleService, private toastr: ToastrManager, private router: Router) { 
    this.buildSignupForm();    //Sign Up Wizard
    this.otpVerifyForm();
  }


  // Signup WIZARD
  private buildSignupForm(){
    this.signUpFormStep1 = this.formBuilder.group({
      username:[null],
      name:this.formBuilder.group({
        prefix: ['Mr.'],
        first_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
        last_name: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
       
      }),     
      phones: this.formBuilder.array([], Validators.required),
      emails: this.formBuilder.array([], Validators.required),        
      title: ['', [Validators.required]],      
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          )
        ])
      ],
      state: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
      city: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
      zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])],
      verified: [true],
      active: [true],     
    });

    this.signUpFormStep2 = this.formBuilder.group({    
      dealerships:this.formBuilder.group({     
        legalcoroporationname: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        dealershipnumber: ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        mainaddressline1: ['', [Validators.required]],
        mainaddressline2: [''],
        city: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
        state: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
        zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])], 

      })         
    });

    this.signUpFormStep3 = this.formBuilder.group({         
      availabilitydate: ['', [Validators.required]],
      time : [this.time, Validators.required],
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]]     
    });
  }

  // OTP VERIFY FORM
  private otpVerifyForm(){
    this.otpVerificationForm = this.formBuilder.group({
      ConfirmationCode: [null, Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('^[0-9 ]*$')])],
      ClientId:[environment.AWS.COGNITO.ClientId],
      Username:[null]
    })
  }
 

  //check the unique email on change

  isEmailUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
  | Observable<{ [key: string]: any } | null>  {    

    return this.userAuthService.dealerEmailExist({ email: control.value })
        .pipe(
          map(data => ({emailTaken: true})),
          catchError(error => of(null))
        );
    return of(null);
  }
  //check the unique phone number on change
    isPhoneNumberUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
      | Observable<{ [key: string]: any } | null>  {     
      return this.userAuthService.dealerPhoneNumberExist({ phone: control.value })
          .pipe(
            map(data => ({phoneNumberTaken: true})),
            catchError(error => of(null))
          );
      return of(null);
    }


  setEmails() {
    let control = <FormArray>this.signUpFormStep1.controls.emails;
    this.step1data.emails.forEach(x => {
      control.push(this.formBuilder.group({ 
        email: ['', [Validators.email, Validators.required], this.isEmailUnique.bind(this)],
        default: [true],
       })
      )
    })
  }

  setPhones() {
    let control = <FormArray>this.signUpFormStep1.controls.phones;
    this.step1data.phones.forEach(x => {
      control.push(this.formBuilder.group({
        phone: ['', Validators.compose([
          Validators.required,
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            {
              validPhone: true
            }
          ),
        ]),
          this.isPhoneNumberUnique.bind(this)
        ],
        default: [true],
        country_code: [environment.DEFAULT_COUNTRY_CODE],
      })
      )
    })
  }

  moveDirection = (validityStatus, direction) => {      
      if (direction === MovingDirection.Backwards) {
                  return true;
      }
      return validityStatus;
  }; 

  scrollToSpecificDiv(direction: MovingDirection): void {   
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" }); 
  }


  ngOnInit() {

    //if seller/dealer loggedin then redirect
    this.userAuthService.checkLoginAndRedirect();

    //setting the page title
    this.titleService.setTitle();
    
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.setPhones();
    this.setEmails();
  }


  finishFunction(){
    

    this.step3submitted = true;
   
    // stop here if form is invalid
    if (this.signUpFormStep3.invalid) {
        return;
    }


    this.pageLoaderService.pageLoader(true);//start showing page loader
    this.pageLoaderService.setLoaderText(environment.MESSAGES.SAVING_INFO_LOADER_TEXT);//setting loader text

    //saving the seller at aws user pool
    this.cognitoUserService.signup(this.signUpFormStep1.value)     
    .pipe(untilDestroyed(this))
    .subscribe(
      (response) => {          
        //console.log('username',response['username'])
        this.verificationPopup(); //open verification popup
        this.pageLoaderService.setLoaderText(environment.MESSAGES.SUCCESS_REGISTER);//setting loader text 
        this.pageLoaderService.pageLoader(false);//hide page loader       
        this.signUpFormStep1.controls['username'].setValue(response['username']);   
        
        this.otpVerificationForm.controls['Username'].setValue(response['username']);  
       // console.log('otpVerificationForm',this.otpVerificationForm.value)

              
        this.toastr.successToastr(environment.MESSAGES.VERIFICATION_PENDING, 'Success!');//showing success toaster
        
      },
      error => {

        this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
        this.pageLoaderService.pageLoader(false);//hide page loader
        this.toastr.errorToastr(environment.MESSAGES.FAILED_TO_REGISTER, 'Oops!');//showing error toaster message

    });
       
  }

  checkFormValidity() {
    this.step1submitted = true;
    if(this.signUpFormStep1.invalid) {
      return;
    }
  }


  checkStep2FormValidity(index) {

    this.step2submitted = true;
    if(this.signUpFormStep2.invalid) {
      if(this.dealershipsItems.length == 0){
        return;
      }    
    }else{
      this.dealershipsItems.push(
        this.signUpFormStep2.value.dealerships
      );
    } 
    this.step2submitted = false;
    this.signUpFormStep2.reset();
    
  }

  // To add new item in array    
  AddDealership() {   
    this.step2submitted = true;
    if(this.signUpFormStep2.invalid) {
      return;
    }   
    this.dealershipsItems.push(
      this.signUpFormStep2.value.dealerships
    );
    //console.log(this.dealershipsItems);
    this.step2submitted = false;
    this.signUpFormStep2.reset();
    
  }  

  // When dealer selects edit option  
  EditDealership(i) {  
    //console.log(this.dealershipsItems[i]);
    this.signUpFormStep2.controls['dealerships'].patchValue(this.dealershipsItems[i]) //binding the user data with signup form   
    this.updatedItem = i;  
    this.IsForUpdate = true;
  }  
  
  // When dealer clicks on update button to submit updated value  
  UpdateDealership() { 
    
    this.step2submitted = true;
    if(this.signUpFormStep2.invalid) {
      return;
    } 
    let i = this.updatedItem;
    this.dealershipsItems[i] = this.signUpFormStep2.value.dealerships;  
    this.IsForUpdate = false;  
    this.step2submitted = false;
    this.signUpFormStep2.reset();
  } 

  // To delete specific item  
  DeleteDealership(i) {  
    var pulled = _.pullAt(this.dealershipsItems, [i]);
  }  


  // OTP Verification
  verificationPopup(){
    this.showOtpForm = true;
    $(this.otpSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true});
  }

  // hide POpup
  hidePopup(){
    this.showOtpForm = false;
    $(this.otpSection.nativeElement).modal('hide'); 
  }

  resendOTP(){
    //confirm seller OTP code
    this.pageLoaderService.setLoaderText(environment.MESSAGES.GENERATING_OTP);//setting loader text
    this.pageLoaderService.pageLoader(true);//show page loader

    this.cognitoUserService.resendSignupOTP()           
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);//hide page loader
          this.toastr.successToastr(environment.MESSAGES.OTP_RESEND, 'Success!'); //showing success toaster          
        },
        error => {    
          console.log('error otp');    
          this.pageLoaderService.pageLoader(false);//hide page loader  
          this.toastr.errorToastr(environment.MESSAGES.OTP_FAILED_RESEND, 'Oops!');//showing error toaster message
        });
  }

  onSubmitOtp(){
    this.otpFormsubmitted = true;
    // stop here if form is invalid
    if (this.otpVerificationForm.invalid) {
      return;
    }   
   
    //confirm dealer OTP code
    this.cognitoUserService.confirmSignupOtp(this.otpVerificationForm.value)     
      .pipe(untilDestroyed(this))      
      .subscribe(
        (response) => {
            
          this.dealershipList['dealerships'] = this.dealershipsItems;   

          var merged = Object.assign(this.signUpFormStep1.value, this.dealershipList, this.signUpFormStep3.value);

          //console.log(merged);
          
          this.pageLoaderService.pageLoader(true);

          this.signupSubscription = this.userAuthService.dealerSignup(merged)
            .subscribe(
              (response) => {

                //hidePopup
                this.hidePopup(); 
                
                      
                this.pageLoaderService.setLoaderText(environment.MESSAGES.SUCCESS_REGISTER);//setting loader text
                this.pageLoaderService.pageLoader(false);//hide page loader

                this.pageLoaderService.pageLoader(false);
                this.toastr.successToastr(environment.MESSAGES.SIGNUP_SUCCESS, 'Success!');//showing success toaster
                this.router.navigate(['/dealer/login']);

              },
              error => {

                //hidePopup
                this.hidePopup(); 

                // Delete User from AWS Congnito too..
                this.deleteDealerFromAWSCognito(this.otpVerificationForm.controls['Username'].value); 

                this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
                this.pageLoaderService.pageLoader(false);//hide page loader
                //this.alertService.setAlert('error', error);
                this.toastr.errorToastr(environment.MESSAGES.FAILED_TO_REGISTER, 'Oops!');//showing error toaster message
                this.router.navigate(['/dealer/signup']);
              });

              
          
              
        },
        error => {    
          //console.log('error otp'); 
          this.pageLoaderService.pageLoader(false);//hide page loader
          this.otpVerificationForm.controls['ConfirmationCode'].setValue(''); 
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  } 

  private deleteDealerFromAWSCognito(u){
    this.cognitoUserService.deleteUser(u)
      .pipe()      
      .subscribe(
        (response) => {},
        error => {});
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }


}
