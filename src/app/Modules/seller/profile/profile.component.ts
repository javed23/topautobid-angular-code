import { Component, OnInit, AfterViewInit, ViewChild, NgZone }from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the component destroyed
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import services

//shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//modules core services
import { UserAuthService, TitleService } from '../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../core/custom-validators';

import { environment } from '../../../../environments/environment'

// Fine Uploader s3
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as Dropzone from 'dropzone';
import * as _ from 'lodash';
declare var $;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  // Reset Dropzone
  @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;

  profilePic: string = '';
  dropzoneUpload: boolean = false;
  applyValidations:boolean =false;
  //define default emails and phones formArrayName 
  data: any = {
    phones: [
      {
        phone: "",
        default_phone: false,
        country_code:environment.DEFAULT_COUNTRY_CODE
      }
    ],
    emails: [
      {
        email: "",
        default_email: false
      }
    ]
  }
  public config:DropzoneConfigInterface;
  


  userData: any = {};
  //define the component properties
  title: string = 'Seller Profile';
  breadcrumbs: any[] = [{ page: 'Home', link: '/seller/home' }, { page: 'Profile', link: '' }]
  profileForm: FormGroup;
  submitted: boolean = false;

  constructor(private location: Location, private formBuilder: FormBuilder, private alertService: AlertService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private titleService: TitleService, private toastr: ToastrManager, private zone: NgZone ) {
    
    this.userData = JSON.parse(localStorage.getItem('loggedinUser'));//parsing the local store data
    this.data.emails = this.userData.emails
    this.data.phones = this.userData.phones
    this.dropzoneInit() //initalize dropzone library
    this.createProfileForm();//initalize form

  }

  private createProfileForm(){
    //define the profile form and its controls
    this.profileForm = this.formBuilder.group({
      id: [localStorage.getItem('loggedinUserId')],
      name: this.formBuilder.group({
        prefix: ['Mr.'],
        first_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        last_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],

      }),
      phones: this.formBuilder.array([], Validators.required),
      default_phone: [null],
      emails: this.formBuilder.array([], Validators.required),
      default_email: [null],
      profile_pic: [null],
    })
  }
  ngAfterViewInit(){
    this.applyValidations = true;    
  }
  ngOnInit() {



    this.titleService.setTitle();//setting page title 
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
          this.profileForm.get('default_phone').setErrors(null);

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



          this.profileForm.get('default_email').setErrors(null);
        }
      }
    );
    //console.log(this.userData)
    this.profileForm.patchValue(this.userData) //binding the user data with profile form

  }

  goBack() {
    this.location.back();
  }
  /*
   Email Cloning and removing
  */
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

  /*
   Phone Cloning and removing
  */
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
        country_code:[environment.DEFAULT_COUNTRY_CODE]
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
        country_code:[environment.DEFAULT_COUNTRY_CODE]
        
      })
    )
  }
  removePhone(index) {
    let control = <FormArray>this.profileForm.controls.phones;
    control.removeAt(index)
  }

  /*
   Email and phone uniqueness funcitons
  */
  //check the unique email on change
  isEmailUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {
    if(this.applyValidations){
      return this.userAuthService.sellerEmailExist({ id: localStorage.getItem('loggedinUserId'), email: control.value })
      .pipe(
        map(data => ({ emailTaken: true })),
        catchError(error => of(null))
      );
    }
    
    return of(null);
  }
  //check the unique phone number on change
  isPhoneNumberUnique(control: AbstractControl): Promise<{ [key: string]: any } | null>
    | Observable<{ [key: string]: any } | null> {
    if(this.applyValidations){
      return this.userAuthService.sellerPhoneNumberExist({ id: localStorage.getItem('loggedinUserId'), phone: control.value })
        .pipe(
          map(data => ({ phoneNumberTaken: true })),
          catchError(error => of(null))
        );
    }
    return of(null);
  }



  //submit the profile form
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.pageLoaderService.pageLoader(true);//start showing page loader
    this.userAuthService.sellerProfile(this.profileForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);// hide page loader 
          localStorage.setItem('loggedinUser', JSON.stringify(response))//setting updated user data to localstorage
          this.userAuthService.isProfileUpdated(true);//trigeering the profile updated observable
          // this.alertService.setAlert('success', environment.MESSAGES.SUCCESS_EDIT);
          this.toastr.successToastr('Profile has been updated successfully.', 'Success!');//showing success toaster

        },
        error => {
          this.pageLoaderService.pageLoader(false);// hide page loader 
          //this.alertService.setAlert('error', error);
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }

  private dropzoneInit() { 
    const componentObj = this;
    this.config = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/seller/profileImageUpload",
      maxFiles: 2,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Change Photo',
      previewsContainer: "#preview",
      addRemoveLinks: true,
      resizeWidth: 125,
      resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },  
      accept: function(file, done) {
        
        console.log('in accept event');
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {
              
              // event.target.result contains base64 encoded image
              console.log('base64',reader.result)
              var base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.isImageCorrupted(base64String,_.toLower(fileExtension))
              console.log('isvalidfile',isValidFile);
              if(!isValidFile){
                //componentObj.toastr.errorToastr('File is corrupted or invalid.', 'Oops!');//showing error toaster 
                done('File is corrupted or invalid.');
                _this.removeFile(file);
                return false;
              } 
              componentObj.pageLoaderService.pageLoader(true);//start showing page loader
              done();             
                       
          };
          reader.readAsDataURL(file); 
      },    
      init: function() {
        const profilePath = componentObj.profileForm.controls['profile_pic'].value
        
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profilePic = (profilePath) ? profilePath : defaultPath;
 
        // Create the mock file:
        const mockFile = { name: "Filename", size: 12345 };

        // Call the default addedfile event handler
        this.emit("addedfile", mockFile);

        // And optionally show the thumbnail of the file:
        console.log('profilePic',this.profilePic)
        this.emit("thumbnail", mockFile, this.profilePic);
       
        this.emit("complete", mockFile);


        this.on("totaluploadprogress",function(progress){
          console.log('progress',progress);
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false);//hide page loader
          }
        })
       
        this.on("success", function(file, serverResponse) {
          // Called after the file successfully uploaded.         
          
          componentObj.profileForm.controls['profile_pic'].setValue(serverResponse);        
          componentObj.zone.run(() => { 
            $(".dz-image img").attr('src', serverResponse);
          });
          this.removeFile(file);
          componentObj.pageLoaderService.pageLoader(false);//hide page loader
        });
        this.on("error", function(file, serverResponse) {
          console.log('serverResponse',serverResponse)
          // Called after the file successfully uploaded.         
          componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          componentObj.toastr.errorToastr(serverResponse, 'Oops!');
          //componentObj.toastr.errorToastr('Could not upload profile picture.', 'Oops!');//showing error toaster message
        });
      }     
    };


  }
  private isImageCorrupted(base64string,type){
    console.log('base64string',base64string);
    if(type=='png'){   
      console.log('get filetype',type)
      const imageData = Array.from(atob(base64string.replace('data:image/png;base64,', '')), c => c.charCodeAt(0))
      const sequence = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]; // in hex: 
      
      //check last 12 elements of array so they contains needed values
      for (let i = 12; i > 0; i--){
          if (imageData[imageData.length - i] !== sequence[12-i]) {
              return false;
          }
      }
      
      return true;
    }
    else if(type=='jpeg' || type=='jpg'){ 
      console.log('get filetype',type)
      const imageDataJpeg = Array.from(atob(base64string.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
      const imageCorrupted = ((imageDataJpeg[imageDataJpeg.length - 1] === 217) && (imageDataJpeg[imageDataJpeg.length - 2] === 255))
      //console.log('imageCorrupted jpeg',imageCorrupted)
      return imageCorrupted;
     
    }
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}