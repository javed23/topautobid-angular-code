import { Component,  OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService  } from '../../../../core/_services'
import { PagedData, Car, Page } from "../../../../core/_models";
import { environment } from '../../../../../environments/environment'


declare let jQuery: any;
declare let $: any;
declare let POTENZA: any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListingComponent implements OnInit {
  @ViewChild('listingTable') listingTable;

  sectionEnable:string='list'
  sliderOptions: NgxGalleryOptions[];
  sliderImages: NgxGalleryImage[];

  page = new Page(); //object of Page type  
  cars = new Array<Car>() //array of Car type 

  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 1,
    pageSize: this.currentPageLimit
  }
  //title and breadcrumbs
  readonly title: string = 'Bid Listing'
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Bid Listing', link: '' }]


  constructor(private commonUtilsService:CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private titleService:TitleService) {
 

    //setting the page title
    this.titleService.setTitle();

    this.setPage(this._defaultPagination);  
  }

  setPage(page) {
    this.page.pageNumber = 0,
    this.page.size = this.currentPageLimit,
    //hit api to fetch data
    this.carService.listingCarsOnDatable(this.page).subscribe(

      //case success
      (pagedData) => {      
      
      this.page = pagedData.page;
     
      //this.cars =  pagedData.data; 
      this.cars =  [...pagedData.data];   

      this.commonUtilsService.hidePageLoader();
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }

  show(type){
    this.sectionEnable = type
    console.log('sectionEnable',this.sectionEnable);
  }

  /**
 * Private function to initalize slider 
 * @return  void
*/
private sliderinit():void{
  this.sliderOptions = [
    { "image": false, "height": "90px","thumbnailsColumns": 1,
    "previewCloseOnClick": true, "previewCloseOnEsc": true,"width": "100%" },
    { "breakpoint": 500, "width": "300px", "height": "300px", }
  ];  
 
  this.sliderImages = [
    {
        small: 'assets/images/bg/cars/small/01.jpg',
        medium: 'assets/images/bg/cars/small/01.jpg',
        big: 'assets/images/bg/cars/bg/01.jpg',
    },
    {
      small: 'assets/images/bg/cars/small/02.jpg',
      medium: 'assets/images/bg/cars/small/02.jpg',
      big: 'assets/images/bg/cars/bg/02.jpg',
    },
    {
      small: 'assets/images/bg/cars/small/03.jpg',
      medium: 'assets/images/bg/cars/small/03.jpg',
      big: 'assets/images/bg/cars/bg/03.jpg',
    }
];
}

  ngOnInit() {
    this.sliderinit()

    POTENZA.priceslider()
      POTENZA.yearslider()
  }

}
