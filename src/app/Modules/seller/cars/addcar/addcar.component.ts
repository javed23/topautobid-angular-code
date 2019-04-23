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

declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;


@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.component.html',
  styleUrls: ['./addcar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddCarComponent implements OnInit {
  
  // Define Page Title and Breadcrumbs
  title:string = 'New Car';
  breadcrumbs:any = [{page:'Home',link:''},{page:'New Car',link:''}]

  // Smooth Scroll To Add Car Form Wizard
  @ViewChild("contentSection") contentSection: ElementRef;

  // Array where we are going to do CRUD operations
  vehicleImagesArray:any = [{interior: []}, {exterior: []}];
  interiorImagesArray:any = [];
  exteriorImagesArray:any = [];
  

  // AddCar Form Group Wizard
  basicInfoWizard: FormGroup;
  uploadVehicleImagesWizard: FormGroup;
  aboutVehicleWizard: FormGroup;
  vehicleConditionWizard: FormGroup;
  pickupLocationWizard: FormGroup;
  

  isBasicInfoSubmitted:boolean = false;
  isVehicleImagesSubmitted:boolean = false;
  isAboutVehicleSubmitted:boolean = false;
  isVehicleConditionSubmitted:boolean = false;
  isPickupLocationSubmitted:boolean = false;

  
  
  isBasicInfoFieldsVisible:boolean = true;  
  isVinSelected:boolean = false;
  isYearSelected:boolean = false;  
  isVehicleAftermarketSelected:boolean = false;
  isVehicleCleanTitleSelected:boolean = false;
  isOtherSelected:boolean = false;
  isVehicleConditionSelected:boolean = false;
  isYearEnabled:boolean = true;

  vehicleImageCategory:string = "interior";

  

  private setVehicleReferenceDefaultValue: string = "Year";    // set Default Vehicle Reference Radio Button Value
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
  public config:DropzoneConfigInterface;
  public vehicleAftermarketConfig:DropzoneConfigInterface;

  
  vehicleImageArray = [];

  // Reset Dropzone
  @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;  

  currentYear: number = new Date().getFullYear();   // get Current Year
  getMakeByYearArray:any = [];
  getModelByMakeIdArray:any = [];
  private _vehicleImage:string = '';
  private _secondKey:string = '';
  private _vehicleAftermarket:string = '';
  private _cleanTitle:string = '';



constructor( private zone:NgZone, private cognitoUserService:CognitoUserService, private location: Location, private alertService: AlertService, private vehicleService: VehicleService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private titleService: TitleService, private commonUtilsService: CommonUtilsService, private toastr: ToastrManager, private router: Router) { 

  this.dropzoneInit()        //initalize dropzone library
  this.basicInfo();          // Initialize Baisc Info Wizard Fields 
  this.uploadVehicleImages(); // Initialize Vehicle Images Wizard Fields
  this.aboutVehicle();       // Initialize About Vehicle Wizard Fields
  this.vehicleCondition();   // Initialize Vehicle Condition Wizard Fields
  this.pickUpLocation();     // Initialize Pickup Location Wizard Fields
}

  /**
  * Initialize Basic Info Wizard Fields.
  */
  private basicInfo(){
    this.basicInfoWizard = this.formBuilder.group({      
        basic_info:this.formBuilder.group({ 
          vehicle_preference: ['Year'],            
          vin_number: [null],
          vehicle_year: [null, Validators.compose([Validators.required])],
          existing_vehicle: [null],
          vehicle_mileage: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{2}$')])],
          vehicle_zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])],
          vehicle_make: [{value: '', disabled: true}, Validators.compose([Validators.required])],
          vehicle_model: [{value: '', disabled: true}, Validators.compose([Validators.required])],
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
          //vehicle_pictures: this.formBuilder.array([]),      
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
        vehicle_pay_off: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])]    
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
        vehicle_condition_value: [null],
        vehicle_condition_description: [null],
        vehicle_condition_pictures: this.formBuilder.array([]),
      }),
      vehicle_offer_in_hands:this.formBuilder.group({        
        vehicle_offer_in_hands_price : [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(10)])],
        vehicle_proof_file: this.formBuilder.array([], Validators.required),       
      }) 
    }); 
  }

  /**
  * Initialize Pickup Location Wizard Fields.
  */
  private pickUpLocation(){     
    this.pickupLocationWizard = this.formBuilder.group({      
      vehicle_pickup:this.formBuilder.group({      
        vehicle_pickup_option:  [null],
        vehicle_address1: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_address2: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_city: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_state: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_zip: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])],
        vehicle_selling_radius: [null, Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(50)])]      
      })           
    });
  }
 
  /**
  * Initialize Dropzone Library(Image Upload).
  */
  private dropzoneInit() { 
    const componentObj = this;
    this.config = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUpload",
      maxFiles: 10,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Click or drag images here to upload',
      previewsContainer: "#preview",
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
       
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {             
              var base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.isImageCorrupted(base64String,_.toLower(fileExtension))              
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
        
        // Create the mock file:
        const mockFile = { name: "Filename", size: 12345 };

        // Call the default addedfile event handler
        this.emit("addedfile", mockFile);

        // And optionally show the thumbnail of the file:
        
        this.emit("thumbnail", mockFile, this.vehicleImage);
       
        this.emit("complete", mockFile);

        this.on('sending', function(file, xhr, formData){
          console.log(file);
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
          });
          this.removeFile(file);
          componentObj.pageLoaderService.pageLoader(false); //hide page loader

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

    this.vehicleAftermarketConfig = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: false,
      url: environment.API_ENDPOINT + "/api/common/imageUpload",
      maxFiles: 10,
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
      dictCancelUpload: 'Delete Pic',
      dictRemoveFile: 'Delete Pic',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      },  
      accept: function(file, done) {        
       
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {             
              var base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.isImageCorrupted(base64String,_.toLower(fileExtension))              
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
          formData.append('folder', 'aftermarket');
        });

        this.on("totaluploadprogress",function(progress){          
          componentObj.pageLoaderService.pageLoader(true);//start showing page loader
          componentObj.pageLoaderService.setLoaderText('Uploading file '+progress+'%');//setting loader text
          if(progress>=100){
            componentObj.pageLoaderService.pageLoader(false); //hide page loader
          }
        })
       
        this.on("success", function(file, serverResponse) {            
          componentObj.zone.run(() => { 
            $(".dz-image img").attr('src', serverResponse);
          });         
          componentObj.pageLoaderService.pageLoader(false); //hide page loader
        });

        this.on("error", function(file, serverResponse) {               
          componentObj.pageLoaderService.pageLoader(false);//hide page loader  
          componentObj.toastr.errorToastr(serverResponse, 'Oops!');         
        });

        this.on("removedfile", function(file) {             
          componentObj.removeImageFromServer(file.xhr.response);              
        });
      }     
    };


  }

  /**
   * remove image from server
   * @param imagePath image url
   */
  removeImageFromServer(imagePath){    
    this.pageLoaderService.pageLoader(true);//start showing page loader
    this.commonUtilsService.removeImageFromServer(imagePath)
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
   * check vehicle reference is selected
   * @param base64string image base 64
   * @param type type of image
   * @return  boolean
   */
  private isImageCorrupted(base64string,type){
    //console.log('base64string',base64string);
    if(type=='png'){   
      //console.log('get filetype',type)
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
     // console.log('get filetype',type)
      const imageDataJpeg = Array.from(atob(base64string.replace('data:image/jpeg;base64,', '')), c => c.charCodeAt(0))
      const imageCorrupted = ((imageDataJpeg[imageDataJpeg.length - 1] === 217) && (imageDataJpeg[imageDataJpeg.length - 2] === 255))
      //console.log('imageCorrupted jpeg',imageCorrupted)
      return imageCorrupted;
     
    }
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

  /** ToDo
   * show last 2 years list in the year dropdown
   */
  createYearRange(){
    var years = [];
    for (var i = 0; i < 2; i++) {
      years.push({
        label: this.currentYear - i,
        value: this.currentYear - i
      });
    }
    return years;
  }

  /**
   * get Vehicles(Makes, Models, Trim...) By Year
   * @param year selected year from dropdown
   * @return  array(vehicle details)
   */
  getVehiclesByYear(year){

    if(year == ''){ this.basicInfoWizard.controls.basic_info.get('vehicle_make').disable(); return; }

    this.pageLoaderService.setLoaderText(environment.MESSAGES.FETCHING_RECORDS);//setting loader text
    this.pageLoaderService.pageLoader(true);//show page loader

    //manually create a data object which have the car unique id and seller id 
    const data ={ year:year }
    //hit api to fetch data
    this.vehicleService.getVehiclesByYear(data).subscribe(

      //case success
    (response) => {      
      
      //console.log(response.makes);
      this.makes = response.makes;
      this.basicInfoWizard.controls.basic_info.get('vehicle_make').enable();
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.pageLoaderService.setLoaderText('');//setting loader text empty
    
    //case error 
    },error => {
      
      this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.basicInfoWizard.controls.basic_info.get('vehicle_make').disable();
      this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

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
   * validate Basic Info Wizard and move to Upload Images Wizard.   
   */
  validateBasicInfoWizard() {    

    this.isBasicInfoSubmitted = true;   

    if(this.basicInfoWizard.invalid) {
      return;
    }

  }

  /**
   * validate Basic Info Wizard and move to Upload Images Wizard.   
   */
  validateVehicleImagesWizard() { 
    
    this.isVehicleImagesSubmitted = true;   

    if(this.uploadVehicleImagesWizard.invalid) {
      return;
    }

  }
  
  /**
   * check vehicle reference is selected
   * @param name vehicle refrence value 
   */
  setVehicleReferenceValue(name: string): void {  

    this.isBasicInfoSubmitted = false;

    const vehicleYear = this.basicInfoWizard.controls.basic_info.get('vehicle_year');
    const vehicleVIN = this.basicInfoWizard.controls.basic_info.get('vin_number');

      if(name == "Year"){
        
        this.isBasicInfoFieldsVisible = true;   
        this.isYearSelected =true; 
        this.isVinSelected = false; 

       /* vehicleYear.setValidators([Validators.required]);
        vehicleVIN.clearValidators();
        vehicleVIN.updateValueAndValidity();
        vehicleYear.updateValueAndValidity(); */

      }else{

        this.isBasicInfoFieldsVisible = false;
        this.isYearSelected =false;      

       /* vehicleVIN.setValidators([Validators.required]);
        vehicleYear.clearValidators();
        vehicleVIN.updateValueAndValidity();
        vehicleYear.updateValueAndValidity(); */
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
   * remove Vehicle Image
   * @param index index of the image array
   * @return  boolean
   */
  removeImage(index): void {
    (this.vehicleImageCategory == 'interior')? _.pullAt(this.interiorImagesArray, [index]): _.pullAt(this.exteriorImagesArray, [index]);
  }

  /**
   * check vehicle aftermarket key has switched on/off
   * @param event object
   * @return  string
   */
  toggleVehicleAfterMarket(event){   
    let vehicleAfterMarketDescription = this.aboutVehicleWizard.controls.vehicle_aftermarket.get('vehicle_aftermarket_description');        
    if( event.target.checked ){
      this.isVehicleAftermarketSelected = true;
      vehicleAfterMarketDescription.setValidators([Validators.required]);
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
  toggleVehicleSecondKey(event){    
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
   * @return  string
   */
  toggleVehicleCleanTitle(event){   
    if ( event.target.checked ) {      
      this.isVehicleCleanTitleSelected = true;      
      this.cleanTitle = 'on'
    }else{
      this.isVehicleCleanTitleSelected = false;     
      this.cleanTitle = 'off'
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
   * check vehicle ownership value
   * @param vehicleOwnership values
   */
  checkVehicleOwnershipRadioValue(vehicleOwnership: string): void { 

    let vehicleOwnershipDescription = this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_ownership_description');
      if(vehicleOwnership == "Other"){
        this.isOtherSelected = true;        
        vehicleOwnershipDescription.setValidators([Validators.required]);        
        vehicleOwnershipDescription.updateValueAndValidity();
      }else{
        this.isOtherSelected = false;        
        vehicleOwnershipDescription.clearValidators();        
        vehicleOwnershipDescription.updateValueAndValidity();
      }
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

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

  
  
 



}
