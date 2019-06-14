import { Component, OnInit, ViewChild, ViewEncapsulation ,ElementRef} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService,DealerService } from '../../../../core/_services'
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
  @ViewChild('bidModal') bidModal:ElementRef;

  sectionEnable: string = 'list'
  sliderOptions: NgxGalleryOptions[];
  sliderImages: NgxGalleryImage[];
  dealerShips:any;
  bidForm:FormGroup;
  legalContacts:any =[];
  page = new Page(); //object of Page type  
  cars = new Array<Car>() //array of Car type 

  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }
  //title and breadcrumbs
  readonly title: string = 'Bid Listing'
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Bid Listing', link: '' }]


  constructor(private dealerService:DealerService,private commonUtilsService: CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private titleService: TitleService) {


    //setting the page title
    this.titleService.setTitle();

    this.setPage(this._defaultPagination);
  }


  private dealerBidForm() {
    this.bidForm = this.formBuilder.group({
      dealership: [null, [ Validators.required]],
      legal_contact: [null, [Validators.required]],
      bid_price: [null]
    });
  }


  setPage(page) {
    this.page.pageNumber = page.offset;
    this.page.size = page.pageSize;
    //hit api to fetch data
    this.carService.listingCarsOnDatable(this.page).subscribe(

      //case success
      (pagedData) => {

        this.page = pagedData.page;

        //this.cars =  pagedData.data; 
        this.cars = [...pagedData.data];

        this.commonUtilsService.hidePageLoader();
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      });
  }

  show(type) {
    this.sectionEnable = type
    console.log('sectionEnable', this.sectionEnable);
  }

  /**
 * Private function to initalize slider 
 * @return  void
*/
  private sliderinit(): void {
    this.sliderOptions = [
      {
        "image": false, "height": "90px", "thumbnailsColumns": 1,
        "previewCloseOnClick": true, "previewCloseOnEsc": true, "width": "100%"
      },
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
    this.dealerBidForm();
  }


/**
   * Search results according to user inputs
   * @param searchValue user inputs to search particular data
   * @return  void
   */
  onSearch(searchValue: string): void {
    this.page.search = searchValue
    this.setPage(this._defaultPagination);
  }

  /**
  * To fetch the records according to type(All, Archive, Sold, Active)
  * @param type type of records(All, WishList, Hidden, Active)
  * @return  void
  */
  onChangeListType(type): void {
    this.page.type = type;
    this.page.totalElements = 0;
    this.setPage(this._defaultPagination);
  }


  /**
    * save the car in wishlist of the dealer 
    * @param $carId    carId is car id to hide the car
    */
  saveToWishList(carId: any) {

    this.carService.saveCarInWishList({ carId: carId }).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been moved to wishlist');
      this.setPage(this._defaultPagination);

    }, error => {
      this.commonUtilsService.onError(error)
    })

  };



  /**
    * save the car in hide list
    * @param $carId    carId is car id to hide the car
    */
  hideCar(carId: any) {
    this.carService.hideCar({ carId: carId }).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been hidden');
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error)
    })
  };



  /**
    * unhide the car in hide list
    * @param $carId    carId is car id to hide the car
    */
   unhideCar(carId: any) {
    this.carService.unhideCar({ carId: carId }).subscribe(response => {
      this.commonUtilsService.onSuccess('Your car has been hidden');
      this.setPage(this._defaultPagination);
    }, error => {
      this.commonUtilsService.onError(error)
    })
  }



  /**
   * this will trigger when user hit the date filter 
   * @param value  is the date filters object
   */
  getDateFilter(value: any) {
    if(Object.keys(value).length === 0 && value.constructor === Object)
    this.page.filters = {};
    else
    this.page.filters['dates'] = value;

    this.setPage(this._defaultPagination);

  };


/**place bid will open the placebid modal popup
 * @param car is the car object for bid
 *will return nothing
 */ 
  placeBid(car:any){
    this.getAllDealShips();
    $(this.bidModal.nativeElement).modal({ backdrop: 'static', keyboard: false, show: true });
  }



  /**
   * get all dealer ships
   */
  getAllDealShips(){
    this.dealerService.getAllDealShips().subscribe(response=>{
    this.dealerShips  = response;
    },error=>{
      this.commonUtilsService.onError(error);
    })
    
  }

/**after selecting the store assign legal contacts to legal contact array
 * @params value is the target value after selecting the dealership
 * return void
 */
  selectStore(value:any):void{
    if(value >=0)this.legalContacts = this.dealerShips[value].legal_contacts;
    else this.legalContacts = [];
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.listingTable.rowDetail.toggleExpandRow(row);
  }


  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
}
