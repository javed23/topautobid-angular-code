import { Component, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ViewEncapsulation, ElementRef, Input, NgZone } from '@angular/core';
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
import { TitleService, DealershipService, CommonUtilsService } from '../../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../../core/custom-validators';

//import models
import { PagedData, Dealership, Page } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment'


declare let $: any;
import * as Dropzone from 'dropzone';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-dealership',
  templateUrl: './create-dealership.component.html',
  styleUrls: ['./create-dealership.component.css'],
  providers: [DealershipService],
})
export class CreateDealershipComponent implements OnInit {
  @Input() isOpen: any;
  @Input() updateExistingDealership: boolean;
  @Input() dealershipsItems: any;
  @Input() dealershipItemIndex: any;
  @Output() onUpdateDealership: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('contentSection') contentSection: ElementRef;

  updatedItem: any = '';
  submitted = false;
  states: any = []
  IsForUpdate: boolean = false;

  newDealershipForm: FormGroup;
  public config: DropzoneConfigInterface;



  constructor(private titleService: TitleService, private http: HttpClient, private commonUtilsService: CommonUtilsService, private dealershipService: DealershipService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager, private formBuilder: FormBuilder, private zone: NgZone, private router: Router) {

    //initalize new dealership form
    this.initalizeNewDealershipForm();

    //fetching us states
    this.fetchStates();

  }


  ngOnChanges(changes: SimpleChanges) {
    //setting the page title
    this.titleService.setTitle();

    if (this.isOpen)
      $(this.contentSection.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });



    if (!this.updateExistingDealership) {
      this.dealershipsItems = [];
      this.resetForm();
    }


    if (this.updateExistingDealership) {
      this.zone.run(() => {
        let dealerProfilePic = (this.dealershipsItems[0]['profile_pic']) ? this.dealershipsItems[0]['profile_pic'] : environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE;
        $(".dz-image img").attr('class', 'img-fluid');
        $(".dz-image img").attr('src', dealerProfilePic);
      });
      this.newDealershipForm.patchValue(this.dealershipsItems[0]) //binding the dealership datat  
    }

  }

  ngOnInit() {
    //initalize dealership dropzone form
    this.dealershipDropzoneInit();

  }

  //initalize dropzone libraray form to upload profile picture
  private dealershipDropzoneInit() {
    const componentObj = this;
    this.config = {
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.FILE_UPLOAD_API,
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Change Photo',
      previewsContainer: "#dealershipPreview",
      resizeWidth: 125,
      resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      accept: function (file, done) {

        console.log('in accept event');
        const reader = new FileReader();
        const _this = this
        reader.onload = function (event) {

          // event.target.result contains base64 encoded image
          console.log('base64', reader.result)
          var base64String = reader.result
          const fileExtension = (file.name).split('.').pop();
          const isValidFile = componentObj.commonUtilsService.isFileCorrupted(base64String, _.toLower(fileExtension))
          //console.log('isvalidfile',isValidFile);
          if (!isValidFile) {
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
      init: function () {    
        const profilePath = componentObj.newDealershipForm.controls['profile_pic'].value
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profilePic = (profilePath) ? profilePath : defaultPath;

        // Create the mock file:
        const mockFile = {};

        // Call the default addedfile event handler
        this.emit("addedfile", mockFile);

        // And optionally show the thumbnail of the file:        
        this.emit("thumbnail", mockFile, this.profilePic);

        this.emit("complete", mockFile);


        this.on("totaluploadprogress",function(progress){
          
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+parseInt(progress)+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false);//hide page loader
          }
        })
        this.on('sending', function (file, xhr, formData) {
          formData.append('folder', 'Dealership');
        });

        this.on("success", function (file, response) {        

          // Called after the file successfully uploaded.         

          componentObj.newDealershipForm.controls['profile_pic'].setValue(response.fileLocation);

          //if we update profile image of existing dealership        
          if (componentObj.updateExistingDealership) {
            componentObj.dealershipsItems[0]['profile_pic'] = response.fileLocation
          }
          componentObj.zone.run(() => {
            $(".dz-image img").attr('class', 'img-fluid');
            $(".dz-image img").attr('src', response.fileLocation);
          });
          this.removeFile(file);
          componentObj.commonUtilsService.hidePageLoader();
        });
        this.on("error", function (file, error) {

          this.removeFile(file);
          componentObj.commonUtilsService.onError(error);

        });       

      }
    };
  }

  //initalize the create new dealership with form controls
  private initalizeNewDealershipForm() {
    this.newDealershipForm = this.formBuilder.group({
      legalcoroporationname: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      dealershipnumber: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      mainaddressline1: [null, [Validators.required]],
      mainaddressline2: [null],
      city: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
      state: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])],
      zip: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{5}$')])],
      profile_pic: [null],
      _id: [null],
      //dealer_id: [localStorage.getItem('loggedinUserId')],
      dealer_id: "5ca1e88f9dac60394419c0bc"

    });
  }
  // push new dealership item 
  pushDealership() {

    if (this.newDealershipForm.invalid) {
      this.submitted = true;
      return;
    }
    //this.newDealershipForm.get('dealer_id').setValue(localStorage.getItem('loggedinUserId'))
    this.newDealershipForm.get('dealer_id').setValue('5ca1e88f9dac60394419c0bc')    
    this.dealershipsItems.push(
      this.newDealershipForm.value
    );   
    this.resetForm();
  }

  // edit newely added dealership
  editNewDealership(index) {

   
    this.IsForUpdate = true
    this.updatedItem = index;  
    this.zone.run(() => {
      let dealerProfilePic = (this.dealershipsItems[index]['profile_pic']) ? this.dealershipsItems[index]['profile_pic'] : environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE;
      $(".dz-image img").attr('src', dealerProfilePic);
    });
    this.newDealershipForm.patchValue(this.dealershipsItems[index])
  }

  // update content of newely added dealership
  onUpdateExistingDealership() {


    if (this.newDealershipForm.invalid) {
      return;
    }
    this.onUpdateDealership.emit({ index: this.dealershipItemIndex, value: this.newDealershipForm.value });
    this.dealershipsItems[this.dealershipItemIndex] = this.newDealershipForm.value;

    this.dealershipService.newDealership([this.newDealershipForm.value])
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
       
          this.resetForm();
          this.dealershipsItems = [];
          $(this.contentSection.nativeElement).modal('hide');
          this.commonUtilsService.onSuccess(environment.MESSAGES.DEALERSHIP_UPDATED);
          this.pageLoaderService.refreshPage(true)
        }, error => {
          this.commonUtilsService.onError(error);

        });

    this.IsForUpdate = false;
    this.resetForm();
  }

  // To delete specific dealership  
  async deleteNewDealership(index) {
    //confirm before deleting car
    if (! await this.commonUtilsService.isDeleteConfirmed()) {
      return;
    }
    var pulled = _.pullAt(this.dealershipsItems, [index]);
  }


  //saving the new dealership
  onCreateDealership() {

    if (this.dealershipsItems.length == 0) {
      this.submitted = true;
      this.commonUtilsService.onError(environment.MESSAGES.ATLEAST_ONE_DEALERSHIP);      
      return;

    } else {     
      //saving the seller at aws user pool
      this.dealershipService.newDealership(this.dealershipsItems)
        .pipe(untilDestroyed(this))
        .subscribe(
          (response) => {
            //this.viewedpages = [];
            this.resetForm();
            this.dealershipsItems = [];
            //this.isLoading = false;

            $(this.contentSection.nativeElement).modal('hide');
            this.commonUtilsService.onSuccess(environment.MESSAGES.DEALERSHIP_ADDED);
            this.pageLoaderService.refreshPage(true)
            //this.setPage(this.defaultPagination);
          }, error => {
            this.commonUtilsService.onError(error);

          });   

    }
  }

  private resetForm() {
    this.zone.run(() => {
      $(".dz-image img").attr('class', 'img-fluid');
      $(".dz-image img").attr('src', environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE);
    });
    //this.newLegalContactForm.controls['id'].setValue(null);      
    this.newDealershipForm.reset();
  }

  //fetching all states
  private fetchStates() {
    this.commonUtilsService.getStates().subscribe(
      (response) => {
        this.states = response;
      }, error => {   
        this.commonUtilsService.onError(error);
      });
  }
  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }


}
