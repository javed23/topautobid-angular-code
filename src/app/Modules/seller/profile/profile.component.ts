import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';

//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../shared/_services'

  //modules core services
  import { UserAuthService } from '../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import { environment } from '../../../../environments/environment'

// Fine Uploader s3
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild("contentSection") contentSection: ElementRef;

  //define default emails and phones formArrayName 
  data: any = {
    phones: [
      {
        phone: "",
        default_phone: false
      }
    ],
    emails: [
      {
        email: "",
        default_email: false
      }
    ]
  }
  userData: any = {};

  //define the component properties
  title: string = 'Seller Profile';
  breadcrumbs: any[] = [{ page: 'Home', link: '#' }, { page: 'Profile', link: '' }]
  profileForm: FormGroup;
  submitted: boolean = false;


  constructor(private location: Location, private formBuilder: FormBuilder, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService) {
    this.userData = JSON.parse(localStorage.getItem('loggedinUser'));
    this.data.emails = this.userData.emails
    this.data.phones = this.userData.phones

    //define the login form and its controls
    this.profileForm = this.formBuilder.group({
      id: [localStorage.getItem('loggedinUserId')],
      model: ['Seller'],
      name: this.formBuilder.group({
        prefix: ['Mr.'],
        first_name: [null, Validators.compose([Validators.required])],
        last_name: [null, Validators.compose([Validators.required])],

      }),
      phones: this.formBuilder.array([], Validators.required),
      default_phone: [null],
      emails: this.formBuilder.array([], Validators.required),
      default_email: [null],
    })
  }



  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.setPhones();
    this.setEmails();
    this.profileForm.get('phones').valueChanges.subscribe(
      data => {
        let selectedDefaultPhones = data.filter((l) => l.default).map((l) => l);
        if (selectedDefaultPhones.length <= 0) {
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneNotSelected': true });
        } else if (selectedDefaultPhones.length > 1) {
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneMaxSelected': true });
        } else {
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneMaxSelected': null });
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneNotSelected': null });
        }
      }
    );

    this.profileForm.get('emails').valueChanges.subscribe(
      data => {

        let selectedDefaultEmails = data.filter((l) => l.default).map((l) => l);
        if (selectedDefaultEmails.length <= 0) {
          this.profileForm.get('default_email').setErrors({ 'defaultEmailNotSelected': true });
        } else if (selectedDefaultEmails.length > 1) {
          this.profileForm.get('default_email').setErrors({ 'defaultEmailMaxSelected': true });
        } else {
          this.profileForm.get('default_email').setErrors({ 'defaultEmailMaxSelected': null });
          this.profileForm.get('default_email').setErrors({ 'defaultEmailNotSelected': null });
        }
      }
    );

    this.profileForm.patchValue(this.userData)

  }

  goBack() {
    this.location.back();
  }
  cloneEmail() {
    let control = <FormArray>this.profileForm.controls.emails;
    control.push(
      this.formBuilder.group({
        email: [null, [Validators.email, Validators.required], this.isEmailUnique.bind(this)],
        default: [false],
      })
    )
  }
  removeEmail(index) {
    let control = <FormArray>this.profileForm.controls.emails;
    control.removeAt(index)
  }
  setEmails() {
    let control = <FormArray>this.profileForm.controls.emails;
    this.data.emails.forEach(x => {
      control.push(this.formBuilder.group({
        email: [null, [Validators.email, Validators.required], this.isEmailUnique.bind(this)],
        default: [false],
      })
      )
    })
  }

  //check the unique email on change
  isEmailUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {

    return this.userAuthService.emailExist({ id: localStorage.getItem('loggedinUserId'), email: control.value, model: 'Seller' })
      .pipe(
        map(data => ({ emailTaken: true })),
        catchError(error => of(null))
      );
    return of(null);
  }
  //check the unique phone number on change
  isPhoneNumberUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {
    return this.userAuthService.phoneNumberExist({ id: localStorage.getItem('loggedinUserId'), phone: control.value, model: 'Seller' })
      .pipe(
        map(data => ({ phoneNumberTaken: true })),
        catchError(error => of(null))
      );
    return of(null);
  }

  setPhones() {
    let control = <FormArray>this.profileForm.controls.phones;
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
        default: [false],
      })
      )
    })
  }


  clonePhone() {
    let control = <FormArray>this.profileForm.controls.phones;
    control.push(
      this.formBuilder.group({
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
        default: [false],
      })
    )
  }
  removePhone(index) {
    let control = <FormArray>this.profileForm.controls.phones;
    control.removeAt(index)
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.pageLoaderService.pageLoader(true);
    this.userAuthService.profile(this.profileForm.value)
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);
          localStorage.setItem('loggedinUser', JSON.stringify(response))
          this.alertService.setAlert('success', environment.MESSAGES.SUCCESS_EDIT);
          
        },
        error => {
          this.pageLoaderService.pageLoader(false);
          this.alertService.setAlert('error', error);
        });
  }

  uploadProfilePic(event) {
    const file = event.target.files.item(0);
    const fileType = file.name.split('.').pop();

    const bucket = new S3(
      {
        accessKeyId: environment.AWS.BUCEKT.ACCESS_KEY,
        secretAccessKey: environment.AWS.BUCEKT.SECRET_KEY,
        region: environment.AWS.BUCEKT.REGION
      }
    );
    const params = {
      Bucket: environment.AWS.BUCEKT.NAME,
      Key: 'dealer_' + localStorage.getItem('loggedinUserId') + '.' + fileType,
      Body: file
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        console.log(environment.MESSAGES.UPLOAD_SUCCESS, err);
        return false;
      }

      console.log(environment.MESSAGES.UPLOAD_SUCCESS, data);
      return true;
    });
  }
}