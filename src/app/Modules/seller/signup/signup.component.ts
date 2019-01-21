import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../shared/_services'

  //modules core services
  import { UserAuthService, TitleService } from '../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';


import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild("contentSection") contentSection: ElementRef;

  //define default emails and phones formArrayName 
  data = {
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


  title: string = 'Seller Signup';
  breadcrumbs: any[] = [{ page: 'Home', link: '' }, { page: 'Signup', link: '' }]
  signupForm: FormGroup;
  submitted: boolean = false;
  signupSubscription: Subscription;

  constructor(private location: Location, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private titleService: TitleService) {

    this.signupForm = this.formBuilder.group({
      name: this.formBuilder.group({
        prefix: ['Mr.'],
        first_name: [null, Validators.compose([Validators.required])],
        last_name: [null, Validators.compose([Validators.required])],

      }),
      phones: this.formBuilder.array([], Validators.required),
      emails: this.formBuilder.array([], Validators.required),
      password: [
        null,
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
      repassword: [null, Validators.compose([Validators.required])],
      model: ['Seller']
    },
      {
        // check whether our password and confirm password match
        validators: CustomValidators.passwordMatchValidator
      }
    );
  }

  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.setPhones();
    this.setEmails();
    this.titleService.setTitle();
  }


  //check the unique email on change

  isEmailUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {

    return this.userAuthService.emailExist({ email: control.value, model: 'Seller' })
      .pipe(
        map(data => ({ emailTaken: true })),
        catchError(error => of(null))
      );
    return of(null);
  }
  //check the unique phone number on change
  isPhoneNumberUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {
    return this.userAuthService.phoneNumberExist({ phone: control.value, model: 'Seller' })
      .pipe(
        map(data => ({ phoneNumberTaken: true })),
        catchError(error => of(null))
      );
    return of(null);
  }

  setEmails() {
    let control = <FormArray>this.signupForm.controls.emails;
    this.data.emails.forEach(x => {
      control.push(this.formBuilder.group({
        email: [null, [Validators.email, Validators.required], this.isEmailUnique.bind(this)],
        default: [true],
      })
      )
    })
  }

  setPhones() {
    let control = <FormArray>this.signupForm.controls.phones;
    this.data.phones.forEach(x => {
      control.push(this.formBuilder.group({
        phone: [null, Validators.compose([
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



  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.pageLoaderService.pageLoader(true);
    this.pageLoaderService.setLoaderText('Registering seller...');//setting loader text
    this.signupSubscription = this.userAuthService.sellerSignup(this.signupForm.value)
      .subscribe(
        (response) => {
          this.pageLoaderService.setLoaderText('Registered...');//setting loader text
          this.pageLoaderService.pageLoader(false);
          this.signupForm.reset();
          this.alertService.setAlert('success', environment.MESSAGES.SIGNUP_SUCCESS);
        },
        error => {
          this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
          this.pageLoaderService.pageLoader(false);
          this.alertService.setAlert('error', error);
        });
  }


  //destroy all subscribers
  ngOnDestroy() {
    //this.signupSubscription.unsubscribe();
  }


}