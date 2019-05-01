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
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { trigger, state, style, animate, transition } from '@angular/animations';
 //shared services
 import { AlertService, PageLoaderService } from '../../../../shared/_services'

 


//import core services
import { UserAuthService, TitleService, CognitoUserService, VehicleService, CommonUtilsService } from '../../../../core/_services'

//import core services
import { CustomValidators } from '../../../../core/custom-validators';

import { environment } from '../../../../../environments/environment'

//import Lodash
import * as _ from 'lodash';

// Fine Uploader s3
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as Dropzone from 'dropzone';

declare let jQuery:any;
declare let $:any;
declare let POTENZA:any;


@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.component.html',
  styleUrls: ['./addcar.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('AnimateList', [
      transition(':enter', [  
        style({opacity: 0, transform: 'translateY(-75%)', offset: 1.0}),
        animate('0.2s 600ms ease-in')
      ])
    ])
   ]
})
export class AddCarComponent implements OnInit {
  // Offer In Hands Popup
  @ViewChild("offerInHandsSection") offerInHandsSection: ElementRef;

  // Define Page Title and Breadcrumbs
  title:string = 'New Car';
  breadcrumbs:any = [{page:'Home',link:''},{page:'New Car',link:''}]

  // Smooth Scroll To Add Car Form Wizard
  @ViewChild("contentSection") contentSection: ElementRef;

  // Array where we are going to do CRUD operations
  vehicleImagesArray:any = [{interior: []}, {exterior: []}];
  interiorImagesArray:any = [];
  exteriorImagesArray:any = [];
  afterMarketImagesArray:any = [];
  getVehicleYear:string = "";
  

  // AddCar Form Group Wizard
  vehicleOption: FormGroup;
  basicInfoWizard: FormGroup;
  uploadVehicleImagesWizard: FormGroup;
  aboutVehicleWizard: FormGroup;
  vehicleConditionWizard: FormGroup;
  pickupLocationWizard: FormGroup;
  offerInHands: FormGroup;
  

  isBasicInfoSubmitted:boolean = false;
  isVehicleImagesSubmitted:boolean = false;
  isAboutVehicleSubmitted:boolean = false;
  isVehicleConditionSubmitted:boolean = false;
  isPickupLocationSubmitted:boolean = false;
  isVehicleOptionSubmitted:boolean = false;
  
  
  isBasicInfoFieldsVisible:boolean = true;  
  isMoreSelected:boolean = false;
  isVehicleOptionSelected:boolean = false;
 
  isVinSelected:boolean = false;
  isYearSelected:boolean = false;  
  isVehicleAftermarketSelected:boolean = false;
  isVehicleCleanTitleSelected:boolean = false;
  isWillingToDriveSelected:boolean = false;
  isOtherSelected:boolean = false;
  isVehicleConditionSelected:boolean = false;
  isYearEnabled:boolean = true;

  vehicleImageCategory:string = "interior";

  

  private setVehicleReferenceDefaultValue: string = "VIN";    // set Default Vehicle Reference Radio Button Value
  makes = [];  
  models = [];
  trims = [];
  bodyStyles= [{name: "2 Door Convertible"}, {name: "2 Door Coupe"}, {name: "4 Door Sedan"}];
  engines= [{name: "4 cylindrical"}, {name: "2 cylindrical"}];
  transmissions= [{name: "Automated-Manual"}, {name: "Continuously Variable Transmission"}, {name: "Dual-Clutch Transmission"}]; 
  doors= [{name: "4 doors"},{name: "2 doors"}];  
  fuelTypes= [{name: "Gasoline"}, {name: "Diesel"}, {name: "Petrol"}];
  driveTypes= [{name: "AWD"}, {name: "FWD"}, {name: "4WD"}];
  interiorColors= [{name: "Black"}, {name: "Blue"}, {name: "Brown"}, {name: "Grey"}, {name: "Red"}, {name: "Silver"}];
  exteriorColors= [{name: "Black"}, {name: "Blue"}, {name: "Brown"}, {name: "Grey"}, {name: "Red"}, {name: "Silver"}];
  interiorMaterials= [{name: "Faux Leather"}, {name: "Brushed Nylon"}, {name: "Nylon Fabric"}];
 

  // Declare DropZone Variables  
  dropzoneUpload: boolean = false;
  public vehicleImagesConfiguration:DropzoneConfigInterface;
  public vehicleAftermarketConfiguration:DropzoneConfigInterface;
  public vehicleConditionConfiguration: DropzoneConfigInterface;  
  public offerInHandsConfiguration: DropzoneConfigInterface;  
  vehicleImageArray = [];

  // Reset Dropzone
  @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;  

  
  getMakeByYearArray:any = [];
  getModelByMakeIdArray:any = [];
  private _vehicleImage:string = '';
  private _secondKey:string = 'off';
  private _vehicleAftermarket:string = 'off';
  private _vehicleOwnership:string = '';
  private _cleanTitle:string = 'off';
  private _willingToDrive:string = '';
  private _vehiclePickedUp:string = '';
  yearRange:any = [];

  currentYear: number = new Date().getFullYear();   // get Current Year



constructor( private zone:NgZone, private cognitoUserService:CognitoUserService, private location: Location, private alertService: AlertService, private vehicleService: VehicleService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private titleService: TitleService, private commonUtilsService: CommonUtilsService, private toastr: ToastrManager, private router: Router) { 

  this.selectVehicleOption(); // Initialize Vehicle Option Fields 
  this.basicInfo();          // Initialize Basic Info Wizard Fields 
  this.uploadVehicleImages(); // Initialize Vehicle Images Wizard Fields
  this.aboutVehicle();       // Initialize About Vehicle Wizard Fields
  this.vehicleCondition();   // Initialize Vehicle Condition Wizard Fields
  this.pickUpLocation();     // Initialize Pickup Location Wizard Fields
  this.offerInHandsPopUp();  //

  this.vehicleImagesDropzoneInit()        //initalize dropzone library
  this.vehicleAfterMarketDropzoneInit(); //initalize dropzone library
  this.vehicleAfterConditionDropzoneInit(); //initalize dropzone library
  this.offerInHandsDropzoneInit(); //initalize dropzone library 
 

}

  /**
  * Initialize Basic Info Wizard Fields.
  */
  private selectVehicleOption(){
    this.vehicleOption = this.formBuilder.group({
      vin_number: [null],
      vehicle_year: [null],
      vehicle_year_value: [null],
      existing_vehicle: [null],
    });
  }

  /**
  * Initialize Basic Info Wizard Fields.
  */
  private basicInfo(){
    this.basicInfoWizard = this.formBuilder.group({      
        basic_info:this.formBuilder.group({             
          vehicle_zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])],
          vehicle_make: [{value: '', disabled: true}, Validators.compose([Validators.required])],
          vehicle_model: [{value: '', disabled: true}, Validators.compose([Validators.required])],
          vehicle_mileage: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{2}$')])],
          vehicle_body_type: [null, Validators.compose([Validators.required])],
          vehicle_trim: [{value: '', disabled: true}, Validators.compose([Validators.required])],
          vehicle_doors: [null, Validators.compose([Validators.required])],
          vehicle_engine: [null, Validators.compose([Validators.required])],
          vehicle_transmission: [null, Validators.compose([Validators.required])],
          vehicle_fuel_type: [null, Validators.compose([Validators.required])],
          vehicle_drive_type: [null, Validators.compose([Validators.required])],
          vehicle_interior_color: [null, Validators.compose([Validators.required])],
          vehicle_exterior_color: [null, Validators.compose([Validators.required])],
          vehicle_interior_material: [null, Validators.compose([Validators.required])],                
        }),    
    });
  }

  /**
  * Initialize Basic Info Wizard Fields.
  */
  private uploadVehicleImages(){
    this.uploadVehicleImagesWizard = this.formBuilder.group({                  
      vehicle_images: this.formBuilder.group({
        vehicle_image_category_name: ['interior'],
        vehicle_image_path: [null]
      })            
    });
  }  

  /**
  * Initialize about Vehicle Wizard Fields.
  */
  private aboutVehicle(){
    this.aboutVehicleWizard = this.formBuilder.group({  
      vehicle_has_second_key: [null],   
      vehicle_aftermarket:this.formBuilder.group({    
        vehicle_aftermarket_value: [null],
        vehicle_aftermarket_description: [null],
        vehicle_aftermarket_pictures: this.formBuilder.array([]),
      }),      
      vehicle_ownership:this.formBuilder.group({        
        vehicle_clean_title : [null],
        vehicle_ownership_value : ['Salvage'],
        vehicle_ownership_description : [null],
        vehicle_finance_bank: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_pay_off: [null, Validators.compose([Validators.required])]    
      })
      
    }); 
  }

  /**
  * Initialize Vehicle Condition Wizard Fields.
  */
  private vehicleCondition(){
    this.vehicleConditionWizard = this.formBuilder.group({      
      vehicle_comments: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],    
      vehicle_condition:this.formBuilder.group({    
        vehicle_condition_value: ['Ready for resale without any reconditioning'],
        vehicle_condition_description: [null],
        vehicle_condition_pictures: this.formBuilder.array([]),
      })
    }); 
  }

  /**
  * Initialize Pickup Location Wizard Fields.
  */
  private pickUpLocation(){     
    this.pickupLocationWizard = this.formBuilder.group({      
      vehicle_to_be_picked_up:  [null],             
      willing_to_drive : [null],
      willing_to_drive_how_many_miles: [null]                      
    });
  }

  /**
  * Initialize Offer In Hands Fields.
  */
  private offerInHandsPopUp(){
    this.offerInHands = this.formBuilder.group({        
      vehicle_offer_in_hands_price : [null],
      vehicle_proof_image: this.formBuilder.array([], Validators.required),       
    })
  }

  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private offerInHandsDropzoneInit(){
    const componentObj = this;
    this.offerInHandsConfiguration = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUploadtoBucket",
      maxFiles: 1,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: '<span class="button red">Upload Proof</span>',
      previewsContainer: "#offerInHandsPreview",
      addRemoveLinks: true,
      resizeWidth: 125,
      resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
      dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },  
      accept: function(file, done) {        
        this.removeAllFiles( true );
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {             
              let base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.commonUtilsService.isImageCorrupted(base64String,_.toLower(fileExtension))              
              if(!isValidFile){
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
                
        
        this.on('sending', function(file, xhr, formData){          
          formData.append('folder', 'OfferInHands');
        });

        this.on("maxfilesexceeded", function(file){
            console.log("Max Image Upload Reached!");
            this.removeFile(file);
        });

        this.on("totaluploadprogress",function(progress){          
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false); //hide page loader
          }
        })
       
        this.on("success", function(file, serverResponse) {  
          /*componentObj.zone.run(() => { 
            $(".dz-image img").attr('src', serverResponse.fileLocation);
            $(".dz-remove").attr('href', serverResponse.fileKey);
          }); */        
          componentObj.pageLoaderService.pageLoader(false); //hide page loader
        });

        this.on("error", function(file, serverResponse) {               
          componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          componentObj.toastr.errorToastr(serverResponse, 'Oops!');         
        });

        /*this.on("removedfile", function(file) {      
                
         componentObj.removeImageFromBucket(file.xhr.response, 'aftermarket');              
        }); */
      }     
    };
  }

  /**
  * Initialize Dropzone Library(Image Upload).
  */
 private vehicleAfterMarketDropzoneInit(){
  const componentObj = this;
  this.vehicleAftermarketConfiguration = {      
    clickable: true,
    paramName: "file",
    uploadMultiple: false,
    url: environment.API_ENDPOINT + "/api/common/imageUploadtoBucket",
    maxFiles: 2,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    acceptedFiles: '.jpg, .png, .jpeg',
    maxFilesize: 2, // MB,
    dictDefaultMessage: 'Click or drag images here to upload',
    previewsContainer: "#vehicleAfterMarketPreview",
    addRemoveLinks: true,
    resizeWidth: 125,
    resizeHeight: 125,
    //createImageThumbnails:false,
    dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
    dictFileTooBig: 'Maximum upload file size limit is 2MB',
    dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
    dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
    headers: {
      'Cache-Control': null,
      'X-Requested-With': null,
    },  
    accept: function(file, done) {        
     
        const reader = new FileReader();
        const _this = this
        reader.onload = function(event) {             
            let base64String = reader.result      
            const fileExtension = (file.name).split('.').pop();
            const isValidFile = componentObj.commonUtilsService.isImageCorrupted(base64String,_.toLower(fileExtension))              
            if(!isValidFile){
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

      this.on('sending', function(file, xhr, formData){          
        formData.append('folder', 'Aftermarket');
      });

      this.on("maxfilesexceeded", function(file){
          console.log("Max Image Upload Reached!");
          this.removeFile(file);
      });

      this.on("totaluploadprogress",function(progress){          
        componentObj.pageLoaderService.pageLoader(true);//start showing page loader
        componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
        if(progress>=100){
          componentObj.pageLoaderService.pageLoader(false); //hide page loader
        }
      })
     
      this.on("success", function(file, serverResponse) {  
        /*componentObj.zone.run(() => { 
          $(".dz-image img").attr('src', serverResponse.fileLocation);
          $(".dz-remove").attr('href', serverResponse.fileKey);
        }); */   
        componentObj.afterMarketImagesArray.push(serverResponse);     
        componentObj.pageLoaderService.pageLoader(false); //hide page loader
      });

      this.on("error", function(file, serverResponse) {               
        componentObj.pageLoaderService.pageLoader(false);//hide page loader  
        componentObj.toastr.errorToastr(serverResponse, 'Oops!');         
      });

      /*this.on("removedfile", function(file) {      
        this.removeFile(file);  
      // componentObj.removeImageFromBucket(file.xhr.response, 'aftermarket');              
      });*/
    }     
  };
}

  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private vehicleAfterConditionDropzoneInit(){
    const componentObj = this;
    this.vehicleConditionConfiguration = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUploadtoBucket",
      maxFiles: 2,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Click or drag images here to upload',
      previewsContainer: "#vehicleConditionPreview",
      addRemoveLinks: true,
      resizeWidth: 125,
      resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: '<i class="fa fa-times" aria-hidden="true"></i>',
      dictRemoveFile: '<i class="fa fa-times" aria-hidden="true"></i>',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },  
      accept: function(file, done) {        
       
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {             
              let base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.commonUtilsService.isImageCorrupted(base64String,_.toLower(fileExtension))              
              if(!isValidFile){
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
        
        this.on('sending', function(file, xhr, formData){          
          formData.append('folder', 'Condition');
        });

        this.on("maxfilesexceeded", function(file){
            console.log("Max Image Upload Reached!");
            this.removeFile(file);
        });

        this.on("totaluploadprogress",function(progress){          
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false); //hide page loader
          }
        })
       
        this.on("success", function(file, serverResponse) {  
          /*componentObj.zone.run(() => { 
            $(".dz-image img").attr('src', serverResponse.fileLocation);
            $(".dz-remove").attr('href', serverResponse.fileKey);
          }); */        
          componentObj.pageLoaderService.pageLoader(false); //hide page loader
        });

        this.on("error", function(file, serverResponse) {               
          componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          componentObj.toastr.errorToastr(serverResponse, 'Oops!');         
        });

        /*this.on("removedfile", function(file) {      
                
         // componentObj.removeImageFromBucket(file.xhr.response, 'aftermarket');              
        }); */
      }     
    };
  }
 
  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private vehicleImagesDropzoneInit() { 
    const componentObj = this;
    this.vehicleImagesConfiguration = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUpload",
      maxFiles: 6,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Click or drag images here to upload',
     // previewsContainer: "#vehicleImagesPreview",      
      addRemoveLinks: true,
      resizeWidth: 125,
      resizeHeight: 125,
      //createImageThumbnails:false,
      dictInvalidFileType: 'Only valid jpeg, jpg, png file is accepted.',
      dictFileTooBig: 'Maximum upload file size limit is 2MB',
      dictCancelUpload: 'Delete Pic',
      dictRemoveFile: 'Delete Pic',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },  
      accept: function(file, done) {            
        
          
          if((componentObj.interiorImagesArray.length +1) > 3 && componentObj.getVehicleImageCategory() == "interior"){
              componentObj.commonUtilsService.onError('You cannot upload any more files.');
              this.removeFile(file);
              return false;
          }

          if((componentObj.exteriorImagesArray.length +1) > 3 && componentObj.getVehicleImageCategory() == "exterior"){
              componentObj.commonUtilsService.onError('You cannot upload any more files.');
              this.removeFile(file);
              return false;
          }


       
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {             
              let base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.commonUtilsService.isImageCorrupted(base64String,_.toLower(fileExtension))              
              if(!isValidFile){
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
        
        this.on('sending', function(file, xhr, formData){    
                  
          formData.append('folder', componentObj.getVehicleImageCategory());         
        });        

        this.on("totaluploadprogress",function(progress){          
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false); //hide page loader
          }
        })
       
        this.on("success", function(file, serverResponse) {

          componentObj.vehicleImage = serverResponse;  
          
          if(componentObj.getVehicleImageCategory() == "interior"){
            componentObj.interiorImagesArray.push(componentObj.vehicleImage);
          }else{
            componentObj.exteriorImagesArray.push(componentObj.vehicleImage);
          }             

          componentObj.zone.run(() => { 
            $(".dz-image img").attr('src', serverResponse);
            $(".dz-remove").attr('href', serverResponse.fileKey);
          });
          this.removeFile(file);
          componentObj.pageLoaderService.pageLoader(false); //hide page loader

        });       

        this.on("error", function(file, serverResponse) {                           
          componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          componentObj.toastr.errorToastr(serverResponse, 'Oops!');
          
        });
      }     
    };  
  }

  /**
   * remove Vehicle Image
   * @param index index of the image array
   * @return  boolean
   */
  removeImage(index): void {
    (this.vehicleImageCategory == 'interior')? _.pullAt(this.interiorImagesArray, [index]): _.pullAt(this.exteriorImagesArray, [index]);
  }

  /**
   * remove image from AWS Bucket
   * @param imagePath image url
   * @param bucket s3 bucket name
   */
  removeImageFromBucket(imagePath, bucket){    
    this.pageLoaderService.pageLoader(true);//start showing page loader
    const params ={ imagePath:imagePath, bucket:bucket }

    this.commonUtilsService.removeImageFromBucket(params)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);// hide page loader         
          this.toastr.successToastr('Image has been removed successfully.', 'Success!');//showing success toaster        
        },
        error => {
          this.pageLoaderService.pageLoader(false);// hide page loader         
          this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
        });
  }  

  /**
  * get vehicle Image Path.
  * @return  string(vehicle image path) .
  */
  get vehicleImage(): string {
    return this._vehicleImage;
  }

  /**
  * set image path.
  * @param $image    string(vehicle image path).
  */
  set vehicleImage($image: string) {
    this._vehicleImage = $image;    
  }

  /**
  * get vehicle Image Category.
  * @return     string(vehicle image category)
  */
  private getVehicleImageCategory(){
    return this.uploadVehicleImagesWizard.controls.vehicle_images.get('vehicle_image_category_name').value;
  }

  

  /**
   * get Vehicles(Makes, Models, Trim...) By Year
   * @param year selected year from dropdown
   * @return  array(vehicle details)
   */
  getVehicleStatisticsByYear(year){

    if(year == ''){ 
      this.basicInfoWizard.controls.basic_info.get('vehicle_make').disable(); this.makes = [];
      this.basicInfoWizard.controls.basic_info.get('vehicle_model').disable(); this.models = [];
      this.basicInfoWizard.controls.basic_info.get('vehicle_trim').disable(); this.trims = [];
      return;
    }

    this.commonUtilsService.showPageLoader();

    //manually create a data object which have the car unique id and seller id 
    const data ={ year:year }
    //hit api to fetch data
    this.commonUtilsService.getVehicleStatisticsByYear(data)
    .pipe(untilDestroyed(this))
    .subscribe(

      //case success
    (response) => {      
      
      this.isVehicleOptionSelected = true;
      this.makes = response.makes;
      this.basicInfoWizard.controls.basic_info.get('vehicle_make').enable();
      this.basicInfoWizard.controls.basic_info.get('vehicle_model').disable(); this.models = [];
      this.basicInfoWizard.controls.basic_info.get('vehicle_trim').disable(); this.trims = [];
      this.commonUtilsService.hidePageLoader();
    
    //case error 
    },error => {
      this.isVehicleOptionSelected = false;      
      this.basicInfoWizard.controls.basic_info.get('vehicle_make').disable(); this.makes = [];
      this.basicInfoWizard.controls.basic_info.get('vehicle_model').disable(); this.models = [];
      this.basicInfoWizard.controls.basic_info.get('vehicle_trim').disable(); this.trims = [];
      this.commonUtilsService.onError(error);

    });
  }

  /**
   * get Models By Make Name
   * @param makeName selected make name from dropdown
   * @return  array(models)
   */
  getModelsByMake(makeName){ 

    (makeName == "")?this.basicInfoWizard.controls.basic_info.get('vehicle_model').disable():this.basicInfoWizard.controls.basic_info.get('vehicle_model').enable();  

    this.models = this.makes.find(x => x.name === makeName).models;     
  }

  /**
   * get Trims array By Model Name
   * @param makeName selected make name from dropdown
   * @return  array(trim)
   */
  getTrimsByModel(modelName){    
    (modelName == "")?this.basicInfoWizard.controls.basic_info.get('vehicle_trim').disable():this.basicInfoWizard.controls.basic_info.get('vehicle_trim').enable();
    this.trims = this.models.find(x => x.name === modelName).trims;  
  }

  /**
   * validate Year Option.   
   * @return  array(vehicle details)   
   */
  validateYearOption(){
    this.isVehicleOptionSubmitted = true;   

    if(this.vehicleOption.invalid) {
      this.isVehicleOptionSelected = false;
      return;
    }

    const vehicleYear = this.vehicleOption.controls.vehicle_year;
    if(vehicleYear.value == "more"){
      this.getVehicleYear = this.vehicleOption.controls.vehicle_year_value.value;
    }else{
      this.getVehicleYear = vehicleYear.value;
    }  
      
    this.getVehicleStatisticsByYear(this.getVehicleYear);
  }

  /**
   * validate Basic Info Wizard and move to Upload Images Wizard.   
   */
  validateBasicInfoWizard() : void {    

    this.isBasicInfoSubmitted = true;   

    if(this.basicInfoWizard.invalid) {
      return;
    }

  }

  /**
   * validate Vehicle Images Wizard and move to about Vehicle  Wizard.   
   */
  validateVehicleImagesWizard() : void { 
    
    this.isVehicleImagesSubmitted = true;   

    if(this.uploadVehicleImagesWizard.invalid) {
      return;
    }

  }

  /**
   * validate About Vehicle Wizard and move to Vehicle Condition Wizard.   
   */
  validateAboutVehicleWizard() : void { 
    
    this.isAboutVehicleSubmitted = true;   

    if(this.aboutVehicleWizard.invalid) {
      return;
    }

  }


  /**
   * validate About Condition Wizard and move to Pickup Location Wizard.   
   */
  validateVehicleConditionWizard() : void { 
    
    this.isVehicleConditionSubmitted = true;   

    if(this.vehicleConditionWizard.invalid) {
      return;
    }

  }

  /**
   * validate Pickup Location Wizard and open offer in hands Popup.   
   */
  validatePickupLocationWizard() : void {
    
    this.isPickupLocationSubmitted = true;   

    if(this.pickupLocationWizard.invalid) {
      return;
    }

    
    $(this.offerInHandsSection.nativeElement).modal({backdrop: 'static', keyboard: false});
    

  }

  /**
   * validate offer in hands popup.   
   */
  validateOfferInHands(){
    console.log('done');
  }

  /**
   * check vehicle year if more selected
   * @param value if more selected 
   */
  setVehicleYear(value: string): void {
    const vehicleYearValue = this.vehicleOption.controls.vehicle_year_value;
    if(value == "more"){
      this.isMoreSelected = true;
      vehicleYearValue.setValidators(Validators.compose([Validators.required,Validators.min(1990), Validators.max(2018)]));
      vehicleYearValue.updateValueAndValidity();
    }else{
      this.isMoreSelected = false;
      vehicleYearValue.clearValidators();
      vehicleYearValue.updateValueAndValidity();
    }   
  }
  
  /**
   * check which vehicle option is selected
   * @param value vehicle refrence value 
   */
  setVehicleOptionValue(value: string): void {    
    const vehicleYear = this.vehicleOption.controls.vehicle_year;
    const vehicleVIN = this.vehicleOption.controls.vin_number;
    const existingVehicle = this.vehicleOption.controls.existing_vehicle;

      if(value == "Year"){    
        vehicleYear.setValidators([Validators.required]);
        vehicleYear.updateValueAndValidity();
        vehicleVIN.clearValidators();
        vehicleVIN.updateValueAndValidity();
        existingVehicle.clearValidators();
        existingVehicle.updateValueAndValidity();
      }

      if(value == "Existing"){
        existingVehicle.setValidators([Validators.required]);
        existingVehicle.updateValueAndValidity();
        vehicleVIN.clearValidators();
        vehicleVIN.updateValueAndValidity();
        vehicleYear.clearValidators();
        vehicleYear.updateValueAndValidity();
      }

      if(value == "VIN"){
        vehicleVIN.setValidators([Validators.required]);        
        vehicleVIN.updateValueAndValidity();
        vehicleYear.clearValidators();
        vehicleYear.updateValueAndValidity();
        existingVehicle.clearValidators();
        existingVehicle.updateValueAndValidity();
      }

      this.setVehicleReferenceDefaultValue = name;  

  } 

  /**
   * check vehicle Image Category is selected
   * @param  vehicleCategory refrence value 
   */
  checkVehicleImageCatgeory(vehicleCategory: string): void {
    this.vehicleImageCategory = vehicleCategory;       
  }

  /**
   * check vehicle reference is selected
   * @param name vehicle refrence value
   * @return  boolean
   */
  isVehicleReferenceSelected(name: string): boolean{ 
      if (!this.setVehicleReferenceDefaultValue) { 
          return false;  
        }  
      return (this.setVehicleReferenceDefaultValue === name); 
  }

  

  /**
   * check vehicle aftermarket key has switched on/off
   * @param event object
   * @return  string
   */
  toggleVehicleAfterMarket(event){   
    let vehicleAfterMarketDescription = this.aboutVehicleWizard.controls.vehicle_aftermarket.get('vehicle_aftermarket_description');     
    vehicleAfterMarketDescription.patchValue('');   
    vehicleAfterMarketDescription.setErrors(null);   
    if( event.target.checked ){
      this.isVehicleAftermarketSelected = true;
      vehicleAfterMarketDescription.setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)]));
      vehicleAfterMarketDescription.updateValueAndValidity();
      this.vehicleAftermarket = 'on';
    }else{ 
      this.isVehicleAftermarketSelected = false;
      vehicleAfterMarketDescription.clearValidators();
      vehicleAfterMarketDescription.updateValueAndValidity();
      this.vehicleAftermarket = 'off';
    }     
  }

  /**
  * get vehicle aftermarket option value.
  * @return  string (on/off) .
  */
  get vehicleAftermarket(): string {
    return this._vehicleAftermarket;
  }

  /**
  * set vehicle aftermarket key value.
  * @param $vehicleAftermarket  string(on/off).
  */
  set vehicleAftermarket($vehicleAftermarket: string) {
    this._vehicleAftermarket = $vehicleAftermarket;    
  }


  /**
   * check vehicle second key has switched on/off
   * @param event object
   * @return  string
   */
  toggleVehicleSecondKey(event): void {    
    ( event.target.checked ) ? this.secondKey = 'on' : this.secondKey = 'off';     
  }

  /**
  * get vehicle second key option value.
  * @return  string(on/off) .
  */
  get secondKey(): string {
    return this._secondKey;
  }

  /**
  * set vehicle second key value.
  * @param $secondKey  string(on/off).
  */
  set secondKey($secondKey: string) {
    this._secondKey = $secondKey;     
  }

  /**
   * check vehicle clean has switched on/off
   * @param event object   
   */
  toggleVehicleCleanTitle(event): void {  
    let vehicleOwnershipDescription = this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_ownership_description');
    vehicleOwnershipDescription.patchValue('');
    if ( event.target.checked ) {      
      this.isVehicleCleanTitleSelected = true; 
           
      this.cleanTitle = 'on'

      this.isOtherSelected=false; 
      
      vehicleOwnershipDescription.clearValidators();        
      vehicleOwnershipDescription.updateValueAndValidity();

    }else{
      this.isVehicleCleanTitleSelected = false; 

      this.cleanTitle = 'off'

      if(this.vehicleOwnership == "Other"){
        this.isOtherSelected = true;        
        vehicleOwnershipDescription.setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)]));        
        vehicleOwnershipDescription.updateValueAndValidity();
      }else{
        this.isOtherSelected = false;        
        vehicleOwnershipDescription.clearValidators();        
        vehicleOwnershipDescription.updateValueAndValidity();
      }       
    }
    
  }

  /**
  * get vehicle clean title option value.
  * @return  string(on/off) .
  */
  get cleanTitle(): string {
    return this._cleanTitle;
  }

  /**
  * set vehicle clean title value.
  * @param $cleanTitle  string(on/off).
  */
  set cleanTitle($cleanTitle: string) {
    this._cleanTitle = $cleanTitle;    
  }

  /**
    * get vehicle ownership option value.
    * @return  string .
    */
  get vehicleOwnership(): string {
    return this._vehicleOwnership;
  }

  /**
  * set Vehicle Ownership value.
  * @param $vehicleOwnership  string.
  */
  set vehicleOwnership($vehicleOwnership: string) {
    this._vehicleOwnership = $vehicleOwnership;    
  }


  /**
   * check vehicle ownership value
   * @param vehicleOwnership values
   */
  checkVehicleOwnershipRadioValue(vehicleOwnership: string): void { 

    let vehicleOwnershipDescription = this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_ownership_description');
    vehicleOwnershipDescription.patchValue('');  
    if(vehicleOwnership == "Other"){
        this.isOtherSelected = true;        
        vehicleOwnershipDescription.setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)]));        
        vehicleOwnershipDescription.updateValueAndValidity();
      }else{
        this.isOtherSelected = false;        
        vehicleOwnershipDescription.clearValidators();        
        vehicleOwnershipDescription.updateValueAndValidity();
      }    
      this.vehicleOwnership = vehicleOwnership;  
  }
  
  /**
   * check vehicle condition value
   * @param vehicleCondition values
   */
  checkVehicleConditionRadioValue(vehicleCondition: string): void { 
    let vehicleConditionDescription = this.vehicleConditionWizard.controls.vehicle_condition.get('vehicle_condition_description');
    vehicleConditionDescription.patchValue(''); 

    if(vehicleCondition == "reconditioning" || vehicleCondition == "functional" || vehicleCondition == "parts"){
      this.isVehicleConditionSelected = true;  
         
      vehicleConditionDescription.setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)]));        
      vehicleConditionDescription.updateValueAndValidity();
    }else{
      this.isVehicleConditionSelected = false; 
             
      vehicleConditionDescription.clearValidators();        
      vehicleConditionDescription.updateValueAndValidity();
    }
  }


  /**
   * check willing to drive key has switched on/off
   * @param event object
   */
  toggleWillingToDrive(event): void {   
    let willingToDriveHowManyMiles = this.pickupLocationWizard.controls['willing_to_drive_how_many_miles'];        
    if( event.target.checked ){
      this.isWillingToDriveSelected = true;
      willingToDriveHowManyMiles.setValidators(Validators.compose([Validators.required,Validators.pattern('^[0-9]{2}$')]));
      willingToDriveHowManyMiles.updateValueAndValidity();
      this.willingToDrive = 'on';
    }else{ 
      this.isWillingToDriveSelected = false;
      willingToDriveHowManyMiles.clearValidators();
      willingToDriveHowManyMiles.updateValueAndValidity();
      this.willingToDrive = 'off';
    }     
  }

  /**
  * get vehicle aftermarket option value.
  * @return  string (on/off) .
  */
  get willingToDrive(): string {
    return this._willingToDrive;
  }

  /**
  * set vehicle aftermarket key value.
  * @param $willingToDrive  string(on/off).
  */
  set willingToDrive($willingToDrive: string) {
    this._willingToDrive = $willingToDrive; 
    //this.pickupLocationWizard.controls['willing_to_drive'].patchValue(this._willingToDrive);   
  }

  /**
   * check vehicle to be pciked up has switched on/off
   * @param event object   
   */
  toggleVehiclePickedUp(event): void {    
    ( event.target.checked ) ? this.vehiclePickedUp = 'on' : this.vehiclePickedUp = 'off';     
  }

  
  /**
  * get vehicle to be picked up value.
  * @return  string(on/off) .
  */
  get vehiclePickedUp(): string {
    return this._vehiclePickedUp;
  }

  /**
  * set vehicle to be picked up value.
  * @param $vehiclePickedUp  string(on/off).
  */
  set vehiclePickedUp($vehiclePickedUp: string) {
    this._vehiclePickedUp = $vehiclePickedUp;  
    //this.pickupLocationWizard.controls['vehicle_to_be_picked_up'].patchValue(this._vehiclePickedUp);  
  }

  /**
   * validate wizard and move to either direction. 
   * @param validityStatus boolean(form validation status)
   * @param direction boolean(wizard direction)
   * @return  boolean
   */
  moveDirection = (validityStatus, direction) => {      
      if (direction === MovingDirection.Backwards) {       
          return true;
      }      
      return validityStatus;
  }; 

  /**
   * smooth scroll to specific div* 
   * @param direction * 
   */
  scrollToSpecificDiv(direction: MovingDirection): void {   
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" }); 
  }

  ngOnInit() {  
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });     
  }

  ngAfterViewInit(){    
    //this.yearRange = this.commonUtilsService.createYearRange();  
    
    for (let i = 0; i < 2; i++) {
      this.yearRange.push({
        label: this.currentYear - i,
        value: this.currentYear - i
      });
    }
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

  
  
 



}
