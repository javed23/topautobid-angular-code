import { Component,  SimpleChanges, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ViewEncapsulation, ElementRef, Input, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../../shared/_services'
  //modules core services
  import { TitleService, DealershipService, CommonUtilsService  } from '../../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../../core/custom-validators';

//import models
import { PagedData, Dealership, Page } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment'


declare let $: any;
import * as Dropzone from 'dropzone';
import * as _ from 'lodash';


@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css'],
  providers: [ DealershipService ],
})
export class CreateContactComponent implements OnInit {
  @Input() isOpen: any;  
  @Input() legalContactItems: any;  
  @Input() dealershipId: any;  
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild('contentSection') contentSection :ElementRef;
  updatedLegalContactItem:any='';
  submitted= false;
  states:any=[]
  IsForUpdateContact: boolean = false; 
  newLegalContactForm: FormGroup;
  public lconfig:DropzoneConfigInterface;
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
    ],
    faxs: [
      {
        number: "",
        default_fax: false
      }
    ]
  }
  
  constructor(private http: HttpClient, private commonUtilsService:CommonUtilsService, private dealershipService: DealershipService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager, private formBuilder: FormBuilder, private zone: NgZone,private router: Router) {

    //fetching us states
    this.fetchStates();

   }
  

  ngOnChanges(changes: SimpleChanges) {

    if(this.isOpen){     
      $(this.contentSection.nativeElement).modal('show'); 
    }
      

  }

  close() {
    this.isOpen = false
    this.onClose.emit(false);    
  } 

  ngOnInit() {
   

    //initalize new legal contact form
    this.initalizeNewLegalContactForm();    
    this.legalContactDropzoneInit() //initalize dropzone library for legal contact    
    this.setPhones();
    this.setEmails();
    this.setFaxs()
    this.checkingDefault();   
  }
  private legalContactDropzoneInit() { 
    const componentObj = this;
    this.lconfig = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUpload",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Change Photo',
      previewsContainer: "#legalContactPreview",  
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
              const isValidFile = componentObj.commonUtilsService.isImageCorrupted(base64String,_.toLower(fileExtension))
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
        const profilePath = componentObj.newLegalContactForm.controls['profile_pic'].value
        
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profilePic = (profilePath) ? profilePath : defaultPath;
  
        // Create the mock file:
        const mockFile = { };
  
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
        this.on('sending', function(file, xhr, formData){
          formData.append('folder', 'Legal_contacts');
        });
       
        this.on("success", function(file, serverResponse) {
          // Called after the file successfully uploaded.         
          
          componentObj.newLegalContactForm.controls['profile_pic'].setValue(serverResponse);        
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
  private initalizeNewLegalContactForm(){
      //define the profile form and its controls
      this.newLegalContactForm = this.formBuilder.group({
        //dealer_id: [localStorage.getItem('loggedinUserId')],
        name: this.formBuilder.group({
          prefix: ['Mr.'],
          first_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
          last_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
  
        }),
        title: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        phones: this.formBuilder.array([], Validators.required),
        default_phone: [null],
        emails: this.formBuilder.array([], Validators.required),
        default_email: [null],
        faxs: this.formBuilder.array([], Validators.required),
        default_fax: [null],
        profile_pic: [null],
        state: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
        city: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')])],
        zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])],
        address_1 : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        address_2 : [null, Validators.compose([Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
        default_legal_contact:[null],
        _id: [null],
      })
      console.log('newLegalContactForm',this.newLegalContactForm);
    }

  private resetForm(){   
    this.zone.run(() => { 
      $(".dz-image img").attr('src', environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE);
      /*this.data = {
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
        ],
        faxs: [
          {
            number: "",
            default_fax: false
          }
        ]
      } */    
    });
    
    this.newLegalContactForm.reset(); 
    /*this.initalizeNewLegalContactForm();  
    this.setPhones();
    this.setEmails();
    this.setFaxs()*/
    
    
   
  }

  //function to check default phone, email or fax is checked or not
  private checkingDefault(){
    this.newLegalContactForm.get('phones').valueChanges.subscribe(
      data => {
        let selectedDefaultPhones = data.filter((l) => l.default).map((l) => l);
        if (selectedDefaultPhones.length <= 0) {
          this.newLegalContactForm.get('default_phone').setErrors({ 'defaultPhoneNotSelected': true });
        } else if (selectedDefaultPhones.length > 1) {
          this.newLegalContactForm.get('default_phone').setErrors({ 'defaultPhoneMaxSelected': true });
        } else {
          this.newLegalContactForm.get('default_phone').setErrors(null);
        }
      }
    );

    this.newLegalContactForm.get('emails').valueChanges.subscribe(
      data => {

        let selectedDefaultEmails = data.filter((l) => l.default).map((l) => l);
        if (selectedDefaultEmails.length <= 0) {
          this.newLegalContactForm.get('default_email').setErrors({ 'defaultEmailNotSelected': true });
        } else if (selectedDefaultEmails.length > 1) {
          this.newLegalContactForm.get('default_email').setErrors({ 'defaultEmailMaxSelected': true });
        } else {
          this.newLegalContactForm.get('default_email').setErrors(null);
        }
      }
    );
    this.newLegalContactForm.get('faxs').valueChanges.subscribe(
      data => {
        let selectedDefaultFaxs = data.filter((l) => l.default).map((l) => l);
        if (selectedDefaultFaxs.length <= 0) {
          this.newLegalContactForm.get('default_fax').setErrors({ 'defaultFaxNotSelected': true });
        } else if (selectedDefaultFaxs.length > 1) {
          this.newLegalContactForm.get('default_fax').setErrors({ 'defaultFaxMaxSelected': true });
        } else {
          this.newLegalContactForm.get('default_fax').setErrors(null);
        }
      }
    );
  }

  /*
   Email Cloning and removing
  */
 cloneEmail() {
  let control = <FormArray>this.newLegalContactForm.controls.emails;
  control.push(
    this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      default: [false],
    })
  )
}
removeEmail(index) {
  let control = <FormArray>this.newLegalContactForm.controls.emails;
  control.removeAt(index)
}
private setEmails() {
  let control = <FormArray>this.newLegalContactForm.controls.emails;
  this.data.emails.forEach(x => {
    control.push(this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      default: [false],
    })
    )
  })
}

/*
 Phone Cloning and removing
*/
private setPhones() {
  let control = <FormArray>this.newLegalContactForm.controls.phones;
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
      ])
      ],      
      default: [false],
      country_code:[environment.DEFAULT_COUNTRY_CODE]
    })
    )
  })
}


clonePhone() {
  let control = <FormArray>this.newLegalContactForm.controls.phones;
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
      ])
      ],
      default: [false],
      country_code:[environment.DEFAULT_COUNTRY_CODE]
      
    })
  )
}
removePhone(index) {
  let control = <FormArray>this.newLegalContactForm.controls.phones;
  control.removeAt(index)
}


/*
 Fax Cloning and removing
*/
private setFaxs() {
  let control = <FormArray>this.newLegalContactForm.controls.faxs;
  this.data.faxs.forEach(x => {
    control.push(this.formBuilder.group({
      number: [null, Validators.compose([
        Validators.required,
        // check whether the entered password has a special character
        CustomValidators.patternValidator(         
          /^\+?[0-9]{6,}$/,
          {
            validFax: true
          }
        ),
      ])
      ],      
      default: [false],      
    })
    )
  })
}


cloneFax() {
  let control = <FormArray>this.newLegalContactForm.controls.faxs;
  control.push(
    this.formBuilder.group({
      number: [null, Validators.compose([
        Validators.required,
        // check whether the entered password has a special character
        CustomValidators.patternValidator(         
          /^\+?[0-9]{6,}$/,
          {
            validFax: true
          }
        ),
      ])
      ],
      default: [false]     
      
    })
  )
}
removeFax(index) {
  let control = <FormArray>this.newLegalContactForm.controls.faxs;
  control.removeAt(index)
}

// push new item 
pushLegalContact() {   
     
  if(this.newLegalContactForm.invalid) {
    this.submitted = true;
    return;
  }   
  this.legalContactItems.push(
    this.newLegalContactForm.value
  );   
  console.log('legalContactItems',this.legalContactItems);
  this.resetForm();    
}
// edit newely added dealership
editNewLegalContact(index) {  

  console.log('index',index);
  this.IsForUpdateContact = true
  this.updatedLegalContactItem = index; 
  console.log('updatedItem',this.updatedLegalContactItem);
  this.zone.run(() => { 
    let profilePic = (this.legalContactItems[index]['profile_pic'])?this.legalContactItems[index]['profile_pic']:environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE;
    $(".dz-image img").attr('src', profilePic);
    this.newLegalContactForm.patchValue(this.legalContactItems[index]) //binding the dealership datat 
  });
    
  console.log('newLegalContactForm',this.newLegalContactForm.value);
  /*Object.keys(this.newDealershipForm.controls).forEach(key => {      
    this.newDealershipForm.get(key).setValue(this.dealershipsItems[index][key])
  });*/
  
  
}

// update content of newely added dealership
updateNewLegalContact() { 
  

  if(this.newLegalContactForm.invalid) {
    console.log('invalid');
    return;
  } 
  this.legalContactItems[this.updatedLegalContactItem] = this.newLegalContactForm.value;   
  this.IsForUpdateContact = false;
  this.resetForm(); 
} 

// To delete specific dealership  
deleteNewLegalContact(index) {  
  var pulled = _.pullAt(this.legalContactItems, [index]);
}

onCreateLegalContact() {   
   
  console.log('legalContactItems',this.legalContactItems);
  let defaultLegalContact = this.legalContactItems.filter((l) => l.default_legal_contact).map((l) => l);
 
  if(this.legalContactItems.length == 0){
    this.submitted = true;
    this.toastr.errorToastr('Please add atleast one legal contact.', 'Oops!');//showing error toaster message    
    return;
  }else if(defaultLegalContact.length>1){
    this.toastr.errorToastr('Primary contact can not be more than one.', 'Oops!');//showing error toaster message
    return;
  }else if(defaultLegalContact.length<=0){
    this.toastr.errorToastr('Please select primary contact.', 'Oops!');//showing error toaster message
    return;
  }else{
    
    //saving the seller at aws user pool
    let data = { id:this.dealershipId, contacts:this.legalContactItems }
    this.dealershipService.newLegalContact(data)     
    .pipe(untilDestroyed(this))
    .subscribe(
      (response) => {  
        //this.viewedpages = [];
        this.resetForm();
        this.legalContactItems = [];   
        
        //this.isLoading = false;
        
        $(this.contentSection.nativeElement).modal('hide');
        this.pageLoaderService.pageLoader(false);//show page loader
        this.pageLoaderService.setLoaderText('');//setting loader text                   
        this.toastr.successToastr(environment.MESSAGES.DEALERSHIP_ADDED, 'Success!'); //showing success toaster 
        this.pageLoaderService.refreshPage(true) 
       // this.setPage(this.defaultPagination);
        
      },error => {

        this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
        this.pageLoaderService.pageLoader(false);//hide page loader
        this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        
      });

      //console.log('dealerships',this.newDealershipForm.value)
       
  }      
}


//fetching all states
private fetchStates(){
  this.commonUtilsService.getStates().subscribe(
    (response) => {  

    this.states = response;

  },error => {    

    this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

  });
  }
  // This method must be present, even if empty.
ngOnDestroy() {
  // To protect you, we'll throw an error if it doesn't exist.
}

}
