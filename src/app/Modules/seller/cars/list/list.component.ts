import { Component,  ViewChild, AfterViewInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../../shared/_services'
  //modules core services
  import { TitleService, CarService  } from '../../../../core/_services'

//import models
import { PagedData, Car, Page } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment'

declare var jQuery: any;
declare var $: any;
declare var POTENZA: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [
    CarService
  ],
  styleUrls: ['./list.component.css'],  
  encapsulation: ViewEncapsulation.None
})

export class ListComponent implements AfterViewInit {
  page = new Page();
  cars = new Array<Car>()
  viewedPages:any=[];
  carObject:Car;
  isModalOpen:boolean=false;
  isBidsModalOpen:boolean=false;
  filtersForm:FormGroup;

 //Defined records limit and records limit options
 currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
 readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
 

  //title and breadcrumbs
  readonly title: string = 'Car Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/seller/home' }, { page: 'Car Listing', link: '' }]

  //default pagination settings
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }




  constructor(private http: HttpClient, private carService: CarService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager, private formBuilder: FormBuilder,) {

    //fetching the data with default settings
    this.setPage(this._defaultPagination,'all');

    //calling filters form initlization method
    this.initalizeFilterForm();
  }
  
  /**
  * component life cycle default method, runs after view page initlization
  * @return void
  */
  ngAfterViewInit():void {
    
    //initializing some jquery neccessary functions    
    POTENZA.toggleFilters()
    POTENZA.priceslider()
    POTENZA.yearslider()
    //POTENZA.tabs()

  }

   /**
  * initializing filters form 
  * @return void
  */
  private initalizeFilterForm():void {
    this.filtersForm = this.formBuilder.group({
      bid: ['$1 - $1000'],
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
      this.pageLoaderService.setLoaderText(environment.MESSAGES.FETCHING_RECORDS);//setting loader text
      this.pageLoaderService.pageLoader(true);//show page loader
    }
    
    //hit api to fetch data
    this.carService.listingCars(this.page).subscribe(

      //case success
      (pagedData) => {      
      
      this.page = pagedData.page;
      let cars = this.cars;

      //if total fetched rows and totalElements(total rowsd from database) is not same
      if (cars.length !== pagedData.page.totalElements) {
        cars = Array.apply(null, Array(pagedData.page.totalElements));        
        cars = cars.map((x, i) => this.cars[i]);
      }    
      const start = this.page.pageNumber * this.page.size;  
      pagedData.data.map((x, i) => cars[i + start] = x);
      this.cars = cars;

      this.pageLoaderService.pageLoader(false);//hide page loader
      this.pageLoaderService.setLoaderText('');//setting loader text empty
    
    //case error 
    },error => {

      this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

    });
  }

  /**
   * Search results according to user inputs
   * @param searchValue user inputs to search particular data
   * @return  void
   */
  onSearch(searchValue : string):void {
    this.viewedPages = [];
    this.page.search = searchValue
    this.setPage(this._defaultPagination,this.page.type);    
  }

   /**
   * To change the records limit on page
   * @param limit number of records to dispaly on page
   * @return  void
   */
  
  public onLimitChange(limit: any): void {   
    this.viewedPages = []; 
    this.currentPageLimit = this._defaultPagination.limit = this._defaultPagination.pageSize = parseInt(limit) 
    this.setPage(this._defaultPagination,this.page.type);
  }

   /**
   * To fetch the records according to type(All, Archive, Sold, Active)
   * @param type type of records(All, Archive, Sold, Active)
   * @return  void
   */
  onChangeListType(type):void {
    this.viewedPages = [];
    this.setPage(this._defaultPagination,type);
  }

   /**
   * To sort the records
   * @param event event object which have column name and direction data
   * @return  void
   */
  onSort(event):void {
    this.viewedPages = [];
    const sort = event.sorts[0];
    this.page.sortProperty = sort.prop
    this.page.sortDirection = sort.dir   
    this.setPage(this._defaultPagination,this.page.type);    
  }

  /**
   * Filters records when user click on 'Apply Filters' button
   * @return  void
   */
  onApplyingFilters():void {
    this.viewedPages = [];
    let values = this.filtersForm.value
    this.page.filters['bid'] = (values.bid).replace(/ /g,'').split('-');
    this.page.filters['years'] = (values.years).replace(/ /g,'').split('-');
    this.setPage(this._defaultPagination,this.page.type);   
  }
   /**
  * Show a popup modal
  * @param index    array index of selected car
  * @param type     which modal popup should show
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
  show(index, type):void {
    this.isBidsModalOpen = this.isModalOpen = false;
    (type=='posted-car-bids')?this.isBidsModalOpen = true:this.isModalOpen = true
    console.log(this.isBidsModalOpen);
    console.log(this.isModalOpen);
    this.carObject = this.cars[index]
  }


  /**
  * Delete a car
  * @param $item    item is car object(selected) to delete
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
  delete(item){

    //confirm before deleting car
    if(! confirm("Are you sure to delete this record ?")) {
      return;
    }

    //manually create a data object which have the car unique id and seller id 
    const data ={
      id:item._id,
      seller_id:localStorage.getItem('loggedinUserId')      
    } 

    //Start process to delete car
      this.pageLoaderService.pageLoader(true);//show page loader
      this.pageLoaderService.setLoaderText(environment.MESSAGES.DELETING_RECORD);//setting loader text

      //hit api to delete record from database
      this.carService.removeCar(data).subscribe(
      
      //case success
      (response) => {
        
          var index = this.cars.indexOf(item, 0);
            if (index > -1)
            {
                this.cars.splice(index, 1);       
            }    
        this.pageLoaderService.pageLoader(false);//hide page loader
        this.pageLoaderService.setLoaderText('');//setting loader text empty
        this.toastr.successToastr(environment.MESSAGES.RECORD_DELETED, 'Success!'); //showing success toaster 

      //case error
      },error => {

        this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
        this.pageLoaderService.pageLoader(false);//hide page loader
        this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

      });
  }  

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}
