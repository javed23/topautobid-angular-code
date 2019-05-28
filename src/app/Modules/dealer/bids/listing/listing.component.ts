import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService  } from '../../../../core/_services'
import { PagedData, Car, Page } from "../../../../core/_models";
import { environment } from '../../../../../environments/environment'




@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  page = new Page(); //object of Page type  
  cars = new Array<Car>() //array of Car type 

  sliderOptions: NgxGalleryOptions[];
  sliderImages: NgxGalleryImage[];

  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 1,
    pageSize: this.currentPageLimit
  }
  //title and breadcrumbs
  readonly title: string = 'Car Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Car Listing', link: '' }]


  constructor(private commonUtilsService:CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private ngZone: NgZone, private titleService:TitleService) {
 

    //setting the page title
    this.titleService.setTitle();

    this.fetchCarListing();   
  }

  private fetchCarListing(){
   
  
    this.page.size = this.currentPageLimit,
    //hit api to fetch data
    this.carService.listingDealersCars(this.page).subscribe(
    //case success
      (pagedData) => {          
      this.ngZone.run( () => {
          this.page = pagedData.page;
          this.cars = pagedData.data
          console.log('Cars',this.cars);
          /*this.cars.car_images.forEach(element => {
            this.sliderImages.push(
              {
                small: element.file_path,
                medium: element.file_path,
                big: element.file_path,
                label:element.file_category
            }
            )
          });*/
      });   
      this.commonUtilsService.hidePageLoader();

    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });

  }

  private sliderinit():void{
    this.sliderOptions = [
      {
          width: '100%',
          height: '365px',     
          imageAnimation: NgxGalleryAnimation.Slide,
          imageArrowsAutoHide:true,          
          thumbnailsArrows:true,
          thumbnailsColumns:5,
          thumbnailMargin: 2,
          thumbnailsPercent:20,
          imageInfinityMove:true,
          thumbnailsAutoHide:true,
          closeIcon:'fa fa-times'
         
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsMargin: 20,
          thumbnailMargin: 20,
           
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
    ];  
    this.sliderImages = [];
  }

  
  ngOnInit() {
  }

}
