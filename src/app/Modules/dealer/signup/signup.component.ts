import { Component, OnInit,  ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import { AbstractControl,  FormBuilder, FormArray,  FormGroup,  FormControl, Validators } from '@angular/forms';
import { Router} from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//import core services
import { UserAuthService, TitleService } from '../../../core/_services'

//import core services
import { CustomValidators } from '../../../core/custom-validators';


declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {


  // Redirect To Form Functionality
  @ViewChild("contentSection") contentSection: ElementRef;

  title:string = 'Register';
  breadcrumbs:any = [{page:'Home',link:'#'},{page:'pages',link:'#'},{page:'Register',link:''}]

  // TimePicker
  time = {hour: 13, minute: 30};
  spinners = true;
  meridian = false;




  // SignUp Form
  signUpFormStep1: FormGroup;
  signUpFormStep2: FormGroup;

  step2submitted:boolean = false;
  step1submitted:boolean = false;
  signupSubscription: Subscription;
  usPhonePattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";



  // Clone Dealership and Locations
  step2data = {
      dealerships: [
        {
          'legalcoroporationname': '', 
          'dealershipnumber': '', 
          'nooflocations': '', 
          locations: [
            {
              'mainaddressline1': '', 
              'mainaddressline2': '', 
              'city': '', 
              'state': '', 
              'zip': ''
            }
          ]
      }
    ]    
  }

  //define default emails and phones formArrayName 
  step1data = {
    phones: [
      {
        phone: "",
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


constructor( private alertService:AlertService, private userAuthService:UserAuthService, private pageLoaderService:PageLoaderService, private formBuilder: FormBuilder, private router: Router,private titleService: TitleService) { 

    this.signUpFormStep1 = this.formBuilder.group({

      name:this.formBuilder.group({
        prefix: ['Mr.'],       
        first_name: ['', Validators.compose([Validators.required])],
        last_name: ['', Validators.compose([Validators.required])],
       
      }),     
      phones: this.formBuilder.array([], Validators.required),   
      emails: this.formBuilder.array([], Validators.required),        
      title: ['', [Validators.required]],      
      password: [
        '',
        Validators.compose([
          Validators.required,
          
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
          ),
          Validators.minLength(10)
        ])
      ],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      //agreement: ['', [Validators.required]],     
    });

    this.signUpFormStep2 = this.formBuilder.group({         
      dealerships: this.formBuilder.array([]),       
      availabilitydate: ['', [Validators.required]],
      time : [this.time, Validators.required],
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]]     
    });


    //console.log(this.signUpFormStep1);
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
      })
      )
    })
  }



  // Clone Dealership Function 
  setDealerships() {    
   let control = <FormArray>this.signUpFormStep2.controls.dealerships;
    console.log(control);
    this.step2data.dealerships.forEach(x => {
      control.push(this.formBuilder.group({ 
        legalcoroporationname: ['', [Validators.required]],
        dealershipnumber: ['', [Validators.required]],
        nooflocations: ['', [Validators.required]],
        locations: this.setLocations(x)
       })
      )
    })
  }
  setLocations(x) {
    let arr = new FormArray([])
    x.locations.forEach(y => {
      arr.push(this.formBuilder.group({ 
        mainaddressline1: ['', [Validators.required]],
        mainaddressline2: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required]] 
      }))
    })
    return arr;
  }

  cloneLocations(control, d){
    control.controls = [];
    for (let i = 0; i < d; i++) {       
      control.push(
        this.formBuilder.group({          
          mainaddressline1: ['', [Validators.required]],
          mainaddressline2: ['', [Validators.required]],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          zip: ['', [Validators.required]]
        })
      )
    }    
  }

  deleteLocation(control, index) {
    control.removeAt(index)
  }

  deleteDealership(index) {
    let control = <FormArray>this.signUpFormStep2.controls.dealerships;
    control.removeAt(index)
  }

  ngOnInit() {
    // Redirect To Form Functionality
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.titleService.setTitle();
    this.setPhones();
    this.setEmails();
    this.setDealerships();
  }

  addEmailField(){    
  }

  finishFunction(){
    

    this.step2submitted = true;
   
    // stop here if form is invalid
    if (this.signUpFormStep2.invalid) {
        return;
    }

    var merged = Object.assign(this.signUpFormStep1.value, this.signUpFormStep2.value);

    console.log(merged);
    
    this.pageLoaderService.pageLoader(true);
    this.signupSubscription = this.userAuthService.dealerSignup(merged)
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);
          this.signUpFormStep2.reset();
          this.signUpFormStep1.reset();
          this.alertService.setAlert('success', 'Successfully registered. Please do login');
        },
        error => {
          this.pageLoaderService.pageLoader(false);
          this.alertService.setAlert('error', error);
        });
    
    


  }

  checkFormValidity(index) {
    this.step1submitted = true;
    if(this.signUpFormStep1.invalid) {
      return;
    }
  }


}
