import { Component,  ViewChild, AfterViewInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'

//import services

  //modules core services
  import { TitleService, CarService, CommonUtilsService  } from '../../../../core/_services'

//import models
import { PagedData, Car, Page } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment'

declare let jQuery: any;
declare let $: any;
declare let POTENZA: any;
import * as _ from 'lodash';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [
    CarService,
    DatePipe,
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeAdapter
    }
  ], 
  styleUrls: ['./list.component.css'],  
  encapsulation: ViewEncapsulation.None
})

export class ListComponent implements AfterViewInit {
  @ViewChild('myTable') table;
  startDateModel:any;
  endDateModel:any;
  page = new Page();
  cars = new Array<Car>()
  viewedPages:any=[];
  car:Car;
  isModalOpen:boolean=false;
  isBidsModalOpen:boolean=false;
  filtersForm:FormGroup;
  datesFilter:any = {};
 
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




  constructor(private commonUtilsService:CommonUtilsService, private http: HttpClient, private carService: CarService, private formBuilder: FormBuilder, private datePipe: DatePipe) {

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
        this.commonUtilsService.showPageLoader();
      }
      
      //hit api to fetch data
      this.carService.listingCars(this.page).subscribe(

        //case success
        (pagedData) => {      
        
        this.page = pagedData.page;
        let cars = this.cars;

        //if total fetched rows and totalElements(total rows from database) is not same
        if (cars.length !== pagedData.page.totalElements) {
          cars = Array.apply(null, Array(pagedData.page.totalElements));        
          cars = cars.map((x, i) => this.cars[i]);
        }    
        const start = this.page.pageNumber * this.page.size;  
        pagedData.data.map((x, i) => cars[i + start] = x);
        this.cars = cars;    
        console.log('Rows',this.cars);
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
      this.viewedPages = [];
      this.page.search = searchValue
      this.setPage(this._defaultPagination,this.page.type);    
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
      //console.log('endDate:'+this.endDate.nativeElement.value);
      this.viewedPages = [];
      let values = this.filtersForm.value
      this.page.filters['bid'] = (values.bid).replace(/ /g,'').split('-');
      this.page.filters['years'] = (values.years).replace(/ /g,'').split('-');
      this.setPage(this._defaultPagination,this.page.type);   
    }
  
 
  /**
   * Filters records when user click on 'Apply Filters' button
   * @return  void
   */
  onStartDateSelected(event:any):void {
    this.datesFilter['start']  = new Date(event.year,event.month-1,event.day+1)    
    //this.datesFilter['transformedStartDate']  = this.datePipe.transform(this.datesFilter['start'], 'yyyy-MM-dd');
    this.datesFilter['transformedStartDate']  = (this.datesFilter['start']).toISOString();
    this.validateDateFilters();       
  }
  /**
   * Filters records when user click on 'Apply Filters' button
   * @return  void
   */
  onEndDateSelected(event:any):void {    
    this.datesFilter['end']  = new Date(event.year,event.month-1,event.day+1)
    //this.datesFilter['transformedEndDate']  = this.datePipe.transform(this.datesFilter['end'], 'yyyy-MM-dd');
    this.datesFilter['transformedEndDate']  = (this.datesFilter['end']).toISOString();
    this.validateDateFilters();        
  }

  /**
  * To validate date filters
  * @return  void
  */
  private validateDateFilters(){
    console.log('dates',this.datesFilter);
    if(! _.has(this.datesFilter, ['start']))
      this.commonUtilsService.onError('Please select start date');
    else if(! _.has(this.datesFilter, ['end']))
      this.commonUtilsService.onError('Please select end date');
    else if(_.has(this.datesFilter, ['end']) && (this.datesFilter['end']).getTime() < (this.datesFilter['start']).getTime()){
      this.endDateModel = null
      this.commonUtilsService.onError('End date should not less than start date');  
      
    }else{
     // this.datesFilter['end'] = this.datePipe.transform(this.datesFilter['end'], 'yyyy-MM-dd');
      //this.datesFilter['start'] = this.datePipe.transform(this.datesFilter['start'], 'yyyy-MM-dd');
      console.log(`start:${this.datesFilter['start']},end:${this.datesFilter['end']}`)
      this.page.filters['dates'] = this.datesFilter;
      this.viewedPages = [];
      this.setPage(this._defaultPagination,this.page.type);
    }
  }
  /**
  * To clear date filters(inputs)
  * @return  void
  */
  clearDateFilters():void{
    if(_.has(this.datesFilter, ['start']) || _.has(this.datesFilter, ['end'])){
      this.startDateModel = null
      this.endDateModel = null
      this.page.filters['dates'] = this.datesFilter = {}
      this.viewedPages = [];  
      delete this.page.filters['dates']; 
      this.setPage(this._defaultPagination,this.page.type);
    }
    
  }
  /**
  * Show a popup modal
  * @param index    array index of selected car
  * @param type     which modal popup should show
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
    show(index, type):void {
      this.isBidsModalOpen = this.isModalOpen = false;
      (type=='posted-car-bids') ? this.isBidsModalOpen = true : this.isModalOpen = true  
      this.car = this.cars[index]
    }


  /**
  * Delete a car
  * @param $item    item is car object(selected) to delete
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
    async delete(item){

      //confirm before deleting car
      if(! await this.commonUtilsService.isDeleteConfirmed()) {
        return;
      }
      
      //manually create a data object which have the car unique id and seller id 
      const data =  {
        id:item._id,
        seller_id:localStorage.getItem('loggedinUserId')      
      } 

      //Start process to delete car
        this.commonUtilsService.showPageLoader();

        //hit api to delete record from database
        this.carService.deleteCar(data).subscribe(
        
        //case success
        (response) => {
          
          let index = this.cars.indexOf(item, 0);
          if (index > -1)           
            this.cars.splice(index, 1);       
            
          this.commonUtilsService.onSuccess(environment.MESSAGES.RECORD_DELETED);          

        //case error
        },error => {
          this.commonUtilsService.onError(error); 
        });
    }  
    
  // This method must be present, even if empty.
    ngOnDestroy() {
      // To protect you, we'll throw an error if it doesn't exist.
    }

}
