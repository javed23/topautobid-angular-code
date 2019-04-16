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
import { UserAuthService, TitleService, CognitoUserService, VehicleService } from '../../../../core/_services'

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

  // Redirect To Add Car Wizard
  @ViewChild("contentSection") contentSection: ElementRef;



  public type: string = 'directive';
  

  // AddCar Form Group Wizard
  basicInfoWizard: FormGroup;
  aboutVehicleWizard: FormGroup;
  vehicleConditionWizard: FormGroup;
  pickupLocationWizard: FormGroup;
  

  isBasicInfoSubmitted:boolean = false;
  isAboutVehicleSubmitted:boolean = false;
  isVehicleConditionSubmitted:boolean = false;
  isPickupLocationSubmitted:boolean = false;


  private selectNewVehicleOption: string = "Year";
  
  isBasicInfoFields:boolean = true;  
  showIfVINSelected:boolean = false;
  showIfYearSelected:boolean = false;
  showVehicleAftermarketFields:boolean = false;
  showVehicleOwnershipFields:boolean = false;
  showIfOtherSelectedFields:boolean = false;
  showVehicleConditionFields:boolean = false;
  

  public show_dialog : boolean = false;



  // Declare DropZone Variables
  vehiclePic: string = '';
  dropzoneUpload: boolean = false;
  public config:DropzoneConfigInterface;
  vehicleImageArray:any = new Array();

  // Reset Dropzone
  @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;

  emails = [{ email: "email1" }, { email: "email2" }, { email: "email3" }, { email: 'email4' }]

  makesArray= [{vehical_make: "ACURA"},{vehical_make: "ALLARD"},{vehical_make: "AMC"},{vehical_make: "AUDI"},{vehical_make: "Other"},{vehical_make: "CHEVROLET"},{vehical_make: "BMW"}];

  

  currentYear: number = new Date().getFullYear();
  getMakeByYearArray:any = [];
  getModelByMakeIdArray:any = [];

constructor( private zone:NgZone, private cognitoUserService:CognitoUserService, private location: Location, private alertService: AlertService, private vehicleService: VehicleService, private userAuthService: UserAuthService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder, private titleService: TitleService, private toastr: ToastrManager, private router: Router) { 

  this.dropzoneInit()        //initalize dropzone library
  this.basicInfo();          // Initialize Baisc Info Wizard Fields 
  this.aboutVehicle();       // Initialize About Vehicle Wizard Fields
  this.vehicleCondition();   // Initialize Vehicle Condition Wizard Fields
  this.pickUpLocation();     // Initialize Pickup Location Wizard Fields
}

  
  /**
  * Initialize Basic Info Wizard Fields.
  */
  private basicInfo(){
    this.basicInfoWizard = this.formBuilder.group({      
        car_details:this.formBuilder.group({ 
          vehicle_preference: ['Year'],            
          vin_number: [null, Validators.compose([Validators.required])],
          vehicle_year: [null],
          existing_vehicle: [null, Validators.compose([Validators.required])],
          vehicle_mileage: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{2}$')])],
          vehicle_zip: [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{5}$')])],
          vehicle_make: [null, Validators.compose([Validators.required])],
          vehicle_model: [null, Validators.compose([Validators.required])],
          vehicle_body_type: [null, Validators.compose([Validators.required])],
          vehicle_trim: [null, Validators.compose([Validators.required])],
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
  * Initialize about Vehicle Wizard Fields.
  */
  private aboutVehicle(){
    this.aboutVehicleWizard = this.formBuilder.group({     
      vehicle_aftermarket:this.formBuilder.group({    
        vehicle_aftermarket_value: ['OFF'],
        vehicle_aftermarket_description: [null],
        vehicle_aftermarket_pictures: this.formBuilder.array([]),
      }),
      vehicle_has_second_key: [null],
      vehicle_ownership:this.formBuilder.group({        
        vehicle_clean_title : ['OFF'],
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

  private dropzoneInit() { 
    const componentObj = this;
    this.config = {      
      clickable: true,
      paramName: "file",
      uploadMultiple: true,
      url: environment.API_ENDPOINT + "/api/dealer/vehicleImageUpload",
      maxFiles: 5,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      acceptedFiles: '.jpg, .png, .jpeg',
      maxFilesize: 2, // MB,
      dictDefaultMessage: 'Upload Pic',
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
        
        //console.log('in accept event');
          const reader = new FileReader();
          const _this = this
          reader.onload = function(event) {
              
              // event.target.result contains base64 encoded image
              //console.log('base64',reader.result)
              var base64String = reader.result      
              const fileExtension = (file.name).split('.').pop();
              const isValidFile = componentObj.isImageCorrupted(base64String,_.toLower(fileExtension))
              //console.log('isvalidfile',isValidFile);
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
        //const vehicleImagePath = componentObj.addCarFormStep.controls['vehicle_pictures'].value
        
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        //this.vehiclePic = (vehicleImagePath) ? vehicleImagePath : defaultPath;
 
        // Create the mock file:
        const mockFile = { name: "Filename", size: 12345 };

        // Call the default addedfile event handler
        //this.emit("addedfile", mockFile);

        // And optionally show the thumbnail of the file:
        //console.log('vehiclePic',this.vehiclePic)
        //this.emit("thumbnail", mockFile, this.vehiclePic);
       
        //this.emit("complete", mockFile);


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
          
          //componentObj.addCarFormStep.controls['vehicle_pictures'].setValue(serverResponse);     
          this.vehicleImageArray.push(serverResponse);   
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

  /**
   * get Makes and Models By Year
   * @param year selected year from dropdown
   * @return  vehicle details
   */
  getVehiclesByYear(year){

    this.pageLoaderService.setLoaderText(environment.MESSAGES.FETCHING_RECORDS);//setting loader text
    this.pageLoaderService.pageLoader(true);//show page loader

    //manually create a data object which have the car unique id and seller id 
    const data ={
      year:year           
    }
    //hit api to fetch data
    this.vehicleService.getVehiclesByYear(data).subscribe(

      //case success
    (response) => {      
      
      console.log(response);

      this.pageLoaderService.pageLoader(false);//hide page loader
      this.pageLoaderService.setLoaderText('');//setting loader text empty
    
    //case error 
    },error => {

      this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

    });
  }

  checkCarFormStep2Validity() {
    this.isAboutVehicleSubmitted = true;
    if(this.aboutVehicleWizard.invalid) {
      return;
    }
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
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });     
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

  toggleVIN() {
    this.show_dialog = !this.show_dialog;    
  }
  
  onChange(email: string, isChecked: boolean) {
    const emailFormArray = <FormArray>this.vehicleConditionWizard.controls.vehicle_option_value;

    if (isChecked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
  }
    
  checkCarFormStep1Validity() {      
    

    const vehiclePreference = this.basicInfoWizard.controls.car_details.get('vehicle_preference');   
    const vehicleVIN = this.basicInfoWizard.controls.car_details.get('vin_number');

    if(vehiclePreference.value == "Year"){      
      vehicleVIN.clearValidators();
      vehicleVIN.updateValueAndValidity();
    }

    this.isBasicInfoSubmitted = true;   

    if(this.basicInfoWizard.invalid) {
      return;
    }
  }

  setVehicleRadioValue(e: string): void {  

    this.isBasicInfoSubmitted = false;

    const vehicleYear = this.basicInfoWizard.controls.car_details.get('vehicle_year');
    const vehicleVIN = this.basicInfoWizard.controls.car_details.get('vin_number');

      if(e == "Year"){
        
        this.isBasicInfoFields = true;   
        this.showIfYearSelected =true; 
        this.showIfVINSelected = false; 

        vehicleYear.setValidators([Validators.required]);
        vehicleVIN.clearValidators();
        vehicleVIN.updateValueAndValidity();
        vehicleYear.updateValueAndValidity();
      }else{

        this.isBasicInfoFields = false;
        this.showIfYearSelected =false;

        vehicleVIN.setValidators([Validators.required]);
        vehicleYear.clearValidators();
        vehicleVIN.updateValueAndValidity();
        vehicleYear.updateValueAndValidity();
      }

      this.selectNewVehicleOption = e;  

  } 

  isSelected(name: string): boolean{ 
      if (!this.selectNewVehicleOption) { 
          return false;  
        }  
      return (this.selectNewVehicleOption === name); 
  }
  
  onEnterVINFunction(vin) {
    //getVehicle Details
    this.vehicleService.getDataByVIN(vin)     
      .pipe(untilDestroyed(this))      
      .subscribe(
        (response) => {
            this.isBasicInfoFields = true;
            console.log(response);
            //console.log(response.Results[0].ErrorCode.charAt(0));   
            
            if(response.Results[0].ErrorCode.charAt(0) == 1 || response.Results[0].ErrorCode.charAt(0) == 4){
              console.log('Invalid VIN');
            }else{              
              this.showIfVINSelected = true;

              // get Vehicle Year
              const vehicleYear = response.Results[0].ModelYear;

              // set all makes in dropdown
              //this.getAllMakesByYear(vehicleYear, response.Results[0].Manufacturer);
              //console.log(response.Results[0].Make);
              //let result = this.makesArray.indexOf(response.Results[0].Make);
              //console.log(this.makeExists(response.Results[0].Make));

              // get Models by Make
              this.getAllModelsByMakeId(response.Results[0].Make);

              this.basicInfoWizard.controls.car_details.get('vehicle_year').setValue(response.Results[0].ModelYear);
              this.basicInfoWizard.controls.car_details.get('vehicle_make').setValue(response.Results[0].Make);
              this.basicInfoWizard.controls.car_details.get('vehicle_model').setValue(response.Results[0].Model);
              this.basicInfoWizard.controls.car_details.get('vehicle_engine').setValue(response.Results[0].EngineCylinders);
              this.basicInfoWizard.controls.car_details.get('vehicle_transmission').setValue(response.Results[0].TransmissionStyle);
              this.basicInfoWizard.controls.car_details.get('vehicle_trim').setValue(response.Results[0].Trim);
              this.basicInfoWizard.controls.car_details.get('vehicle_doors').setValue(response.Results[0].Doors);
              this.basicInfoWizard.controls.car_details.get('vehicle_body_type').setValue(response.Results[0].BodyClass);
              this.basicInfoWizard.controls.car_details.get('vehicle_fuel_type').setValue(response.Results[0].FuelTypePrimary);


              this.basicInfoWizard.controls.car_details.get('vehicle_mileage').setValue(15);
            }                          
        },
        error => { 
          this.isBasicInfoFields = false;   
          console.log(error);
        });
  }

  createYearRange(){
    var items = [];
    for (var i = 0; i < 25; i++) {
      items.push({
        label: this.currentYear - i,
        value: this.currentYear - i
      });
    }
    return items;
  }

  getAllMakesByYear(year,Manufacturer){
    //console.log(year);

    this.vehicleService.getAllMakesByYear(year, Manufacturer)     
      .pipe(untilDestroyed(this))      
      .subscribe(
        (response) => {           
            //console.log(response);   
            this.getMakeByYearArray =  response.Results;                         
        },
        error => { 
          console.log(error);
        });
  }

  getAllModelsByMakeId(makeID){
    //console.log(makeID);

    this.vehicleService.getAllModelsByMakeId(makeID)     
      .pipe(untilDestroyed(this))      
      .subscribe(
        (response) => {           
            //console.log(response);   
            this.getModelByMakeIdArray =  response.Results;                           
        },
        error => { 
          console.log(error);
        });
  }

  checkAfterMarketOption(event){
    const vehicleAfterMarketDescription = this.aboutVehicleWizard.controls.vehicle_aftermarket.get('vehicle_aftermarket_description');
    if ( event.target.checked ) {      
      this.showVehicleAftermarketFields = true;
      vehicleAfterMarketDescription.setValidators([Validators.required]);
      vehicleAfterMarketDescription.updateValueAndValidity();
      this.aboutVehicleWizard.controls.vehicle_aftermarket.get('vehicle_aftermarket_value').setValue('ON');
    }else{
      this.showVehicleAftermarketFields = false;
      vehicleAfterMarketDescription.clearValidators();
      vehicleAfterMarketDescription.updateValueAndValidity();
      this.aboutVehicleWizard.controls.vehicle_aftermarket.get('vehicle_aftermarket_value').setValue('OFF');
    }
  }

  checkCleanTitleOption(event){   
    if ( event.target.checked ) {      
      this.showVehicleOwnershipFields = true;      
      this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_clean_title').setValue('ON');
    }else{
      this.showVehicleOwnershipFields = false;     
      this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_clean_title').setValue('OFF');
    }
  }

  setVehicleOwnershipRadioValue(e: string): void {  

    const vehicleOwnershipDescription = this.aboutVehicleWizard.controls.vehicle_ownership.get('vehicle_ownership_description');

      if(e == "Other"){
        this.showIfOtherSelectedFields = true;        
        vehicleOwnershipDescription.setValidators([Validators.required]);        
        vehicleOwnershipDescription.updateValueAndValidity();
      }else{
        this.showIfOtherSelectedFields = false;        
        vehicleOwnershipDescription.clearValidators();        
        vehicleOwnershipDescription.updateValueAndValidity();
      }
  }
  
  setVehicleConditionRadioValue(e: string): void {  

    const vehicleConditionDescription = this.vehicleConditionWizard.controls.vehicle_condition.get('vehicle_condition_description');

      if(e == "reconditioning" || e == "functional" || e == "parts"){
        this.showVehicleConditionFields = true;        
        vehicleConditionDescription.setValidators([Validators.required]);        
        vehicleConditionDescription.updateValueAndValidity();
      }else{
        this.showVehicleConditionFields = false;        
        vehicleConditionDescription.clearValidators();        
        vehicleConditionDescription.updateValueAndValidity();
      }
  }

  checkSecondKeyOption(event){    
    if ( event.target.checked ) {      
      this.aboutVehicleWizard.controls.vehicle_has_second_key.setValue('ON');
    }else{     
      this.aboutVehicleWizard.controls.vehicle_has_second_key.setValue('OFF');
    }
  }

  makeExists(vehical_make) {
    return this.makesArray.some(function(el) {
      return el.vehical_make === vehical_make;
    }); 
  }



}
