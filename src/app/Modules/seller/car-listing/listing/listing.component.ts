import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService  } from '../../../../core/_services'
import { PagedData, Car, Page } from "../../../../core/_models";
import { environment } from '../../../../../environments/environment'


declare let jQuery: any;
declare let $: any;
declare let POTENZA: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  page = new Page(); //object of Page type
  cars = new Array<Car>() //array of Car type 
  filtersForm:FormGroup;
  isGridListing:boolean=false; //set boolean value to show/hide listing (grid/list)
  viewedPages:any=[]; //array of page number which have been reviewed by user

  //default pagination, limit(records on per page) settings
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }

  //title and breadcrumbs
  readonly title: string = 'Car Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/seller/home' }, { page: 'Car Listing', link: '' }]


  constructor(private commonUtilsService:CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private ngZone: NgZone) {
    //fetching the data with default settings
    this.setPage(this._defaultPagination,'all');
  }

  ngOnInit() {
     //calling filters form initlization method
     this.initalizeFilterForm();
  }
/**
* component life cycle default method, runs after view page initlization
* @return void
*/
  ngAfterViewInit():void {  
    
    //initalize the price & year slider on view page
    POTENZA.priceslider() 
    POTENZA.yearslider()  
    this.onApplyingFilters()      
      
  }

/**
* Filters records when user click on 'Apply Filters' button
* @return  void
*/
  private onApplyingFilters():void { 

    let componentObject = this //assign the component object to use with jquery 
    
    //when we stop price slider
    $( "#price-range" ).on( "slidestop", function( event, ui ) {        
      componentObject.page.filters['price_range'] = [ui.values[0],ui.values[1]] 
      componentObject.viewedPages = [];
      componentObject.setPage(componentObject._defaultPagination,componentObject.page.type);     
    });

    //when we stop year slider
    $( "#year-range" ).on( "slidestop", function( event, ui ) {
      componentObject.page.filters['year_range'] = [ui.values[0],ui.values[1]]
      componentObject.viewedPages = [];
      componentObject.setPage(componentObject._defaultPagination,componentObject.page.type);
    });
  
  }

/**
* change listing type list/grid
* @return void
*/
  onChangeListingType():void {
    this.isGridListing = (this.isGridListing)?false:true
  }

/**
* initializing filters form 
* @return void
*/
  private initalizeFilterForm():void {
    this.filtersForm = this.formBuilder.group({
      amount: ['$1 - $1000'],
      years:['2010 - 2018']      
    })
  }

/**
 * Populate the table with new data based on the page number
 * @param page The page to select
 * @param type Result type (All, Active, Archived)
*/
  setPage(page, type) {   

    this.page.type = type;
    this.page.pageNumber = page.offset;
    this.page.size = page.pageSize;

    //Do not fetch page data if page is already clicked and paginated
    if( _.includes(this.viewedPages, this.page.pageNumber))
      return;
    else    
      this.viewedPages.push(this.page.pageNumber)

    //Do not show page loader if fetching results using search
    if(!this.page.search){
      this.commonUtilsService.showPageLoader();
    }
    
    //hit api to fetch data
    this.carService.listingCars(this.page).subscribe(

      //case success
      (pagedData) => {          
      this.ngZone.run( () => {
          this.page = pagedData.page;
          this.cars = pagedData.data
      });
      console.log('rows',this.cars);
      /*
      //if total fetched rows and totalElements(total rows from database) is not same
      if (cars.length !== pagedData.page.totalElements) {
        cars = Array.apply(null, Array(pagedData.page.totalElements));        
        cars = cars.map((x, i) => this.cars[i]);
      }    
      const start = this.page.pageNumber * this.page.size;  
      pagedData.data.map((x, i) => cars[i + start] = x);
      this.cars = cars;  */ 
      //console.log('Rows',this.cars);
      this.commonUtilsService.hidePageLoader();
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }


/**
 * Search results according to user inputs
 * @param searchValue user inputs to search particular data
 * @return  void
*/
  onSearch(searchValue : string):void {
    console.log('hi');
    this.viewedPages = [];
    this.page.search = searchValue
    this.setPage(this._defaultPagination,this.page.type);
  }

  onPageChange(event){
    console.log(event);
  }

/**
 * To change the records limit on page
 * @param limit number of records to dispaly on page
 * @return  void
*/
  
  onLimitChange(limit: any): void {   
    this.viewedPages = []; 
    this.currentPageLimit = this._defaultPagination.limit = this._defaultPagination.pageSize = parseInt(limit) 
    this.setPage(this._defaultPagination,this.page.type);
  }

/**
 * To sort the records
 * @param event event object which have column name and direction data
 * @return  void
*/
  onSort(event):void {
    
    this.viewedPages = [];
    const sortingObject = event.target.value.split(',');    
    this.page.sortProperty = sortingObject[0]
    this.page.sortDirection = sortingObject[1] 
    console.log('this.page',this.page); 
    this.setPage(this._defaultPagination,this.page.type);  
  }

}
