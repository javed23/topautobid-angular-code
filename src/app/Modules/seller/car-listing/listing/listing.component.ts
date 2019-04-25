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
  isGridListing:boolean=true; //set boolean value to show/hide listing (grid/list)
  viewedPages:any=[]; //array of page number which have been reviewed by user
  currentPage:number =0;
  yearsRange:any=[]
  makes:any=[]
  models:any=[]
  trims:any=[]
  
  //default pagination, limit(records on per page) settings
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  
  readonly paginationLinks: number = 1//environment.DEFAULT_PAGES_PAGINATION   //Defines the maximum number of page links to display 
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 1,
    pageSize: this.currentPageLimit
  }

  //year & price 
  private _year
  private _price

  //title and breadcrumbs
  readonly title: string = 'Car Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/seller/home' }, { page: 'Car Listing', link: '' }]


  constructor(private commonUtilsService:CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private ngZone: NgZone) {
    //fetching the data with default settings
    this.setPage(this._defaultPagination,'all');
    this.page.filters={}
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
    let currentYear = new Date().getFullYear();  
    //initalize the price & year slider on view page
    POTENZA.priceslider() 
    POTENZA.yearslider()  
    POTENZA.featurelist()
    this.onApplyingFilters()    
    for (var i = 0; i < 2; i++) {
      this.yearsRange.push({
        label: currentYear - i,
        value: currentYear - i
      });
    }
   // this.yearsRange = this.commonUtilsService.createYearRange();
    console.log('years',typeof this.yearsRange);  
    
  }

/**
* Filters records when user click on 'Apply Filters' button
* @return  void
*/
  private onApplyingFilters():void { 

    let componentRefrence = this //assign the component object to use with jquery 
    
    //when we stop price slider
    $( "#price-range" ).on( "slidestop", function( event, ui ) {        
      componentRefrence.page.filters['price_range'] = [ui.values[0],ui.values[1]] 
      componentRefrence.viewedPages = [];
      componentRefrence.setPage(componentRefrence._defaultPagination,componentRefrence.page.type);     
    });

    //when we stop year slider
    $( "#year-range" ).on( "slidestop", function( event, ui ) {
      componentRefrence.page.filters['year_range'] = [ui.values[0],ui.values[1]]
      componentRefrence.viewedPages = [];
      componentRefrence.setPage(componentRefrence._defaultPagination,componentRefrence.page.type);
    });

    $( "#year-range" ).on( "slide", function( event, ui ) {       
      componentRefrence.year =    ui.values[0] + " - " + ui.values[1]         
    });
    $( "#price-range" ).on( "slide", function( event, ui ) {       
      componentRefrence.price =    "$"+ui.values[0] + " - " + '$'+ui.values[1]         
    });
  
  }

/**
* change listing type list/grid
* @return void
*/
  onChangeListingType(listingType:string):void {
    this.isGridListing = (listingType=='list')?false:true
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

  onPageChange(pageNumber:number){
    console.log(pageNumber);
    this.currentPage = pageNumber
    this.setPage({offset:pageNumber,pageSize:this.currentPageLimit}, this.page.type)
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

/**
* get & set method of private property named year.
* @return     Star rating selected by iser .
*/
 get year(): string {
  return this._year;
 }

/**
* set rating.
* @param year    string(year range) which is selected by user.
*/
  set year(year: string) {
    this._year = year;
    console.log('this._year',this._year)
    this.filtersForm.controls['years'].patchValue(this._year);  
  }

/**
* get & set method of private property named price.
* @return     Star rating selected by iser .
*/
get price(): string {
  return this.price;
}

/**
* set rating.
* @param year    string(year range) which is selected by user.
*/
  set price(price: string) {
    this._price = price;
    console.log('this._price',this._price)
    this.filtersForm.controls['amount'].patchValue(this._price);      
  }



/**
   * get Vehicles(Makes, Models, Trim...) By Year
   * @param year selected year from dropdown
   * @return  array(vehicle details)
   */
  vehicleStatisticsByYear(option,event){
    let yearOptions = (_.has(this.page.filters, ['year']))? this.page.filters['year']:[];   
    let index = yearOptions.indexOf(option.value);
    (index>=0)?_.pullAt(yearOptions, [index])  : yearOptions.push(option.value)     
    this.page.filters['year'] = yearOptions;
  // (event.target.checked)?yearOptions[option.value] = option.value : _.pullAt(yearOptions, [option.value])
   console.log('yearOptions',yearOptions);
   

    //hit api to fetch data
    this.commonUtilsService.getVehicleStatisticsByMultipleyear({ year: yearOptions}).subscribe(
      //case success
    (response) => { 
      let makes = []; 
      response.forEach(element => {        
        (element.makes).forEach(element => {
          makes.push(element)
        });
      });
      this.makes = makes;  
      this.viewedPages = [];
      this.setPage(this._defaultPagination,this.page.type);     
    //case error 
    },error => {    
      this.commonUtilsService.onError(error);
    });
  }

  /**
   * get Models By Make Name
   * @param makeName selected make name from dropdown
   * @return  array(models)
   */
  getModelsByMake(makeName){ 

    this.models = this.makes.find(x => x.name === makeName).models;     
  }

  /**
   * get Trims array By Model Name
   * @param makeName selected make name from dropdown
   * @return  array(trim)
   */
  getTrimsByModel(modelName){    
    
    this.trims = this.models.find(x => x.name === modelName).trims;  
  }






}
