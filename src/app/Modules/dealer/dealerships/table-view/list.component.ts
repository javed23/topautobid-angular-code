import { Component,  OnInit, ViewChild, AfterViewInit, ViewEncapsulation, ElementRef, NgZone } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { untilDestroyed } from 'ngx-take-until-destroy';// unsubscribe from observables when the  component destroyed
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import services

  //shared services
  import { AlertService, PageLoaderService } from '../../../../shared/_services'
  //modules core services
  import { TitleService, DealershipService, CommonUtilsService  } from '../../../../core/_services'

//import custom validators
import { CustomValidators } from '../../../../core/custom-validators';

//import models
import { PagedData, Dealership, Page } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment'


declare var $: any;
declare var POTENZA: any;
import * as Dropzone from 'dropzone';
import * as _ from 'lodash';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [
    DealershipService
  ],
  styleUrls: ['./list.component.css'],  
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit, AfterViewInit {

  startDateModel:any;
  endDateModel:any;
  datesFilter:any = {};  
  @ViewChild('listingTable') listingTable; 
  page = new Page();

  // default modal status
  isModalOpened:boolean = false;
  isDealershipModalOpened:boolean = false;
  isCreateDealershipModalOpened:boolean = false;
  isCreateContactModalOpened:boolean = false;

  dealerships = new Array<Dealership>() 
  viewedPages:any=[];
  dealershipObject:Dealership;
  dealershipId:any='';
  dealershipItemIndex:any;
  filtersForm:FormGroup;
  updateExistingDealership:boolean = false;
  dealershipsItems:any = []
  legalContactItems:any = []

  //Defined records limit and records limit options
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  
  //default pagination settings
  defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }
  
  //title and breadcrumbs
  readonly title: string = 'Dealership Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dealership Listing', link: '' }]
   
  constructor(private http: HttpClient, private titleService:TitleService,private commonUtilsService:CommonUtilsService, private dealershipService: DealershipService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager, private formBuilder: FormBuilder, private ngZone: NgZone) {
    
    this.pageLoaderService.shouldPageLoad.subscribe((SholdPageRefresh: boolean) => {
     
      if(SholdPageRefresh){
        this.viewedPages = [];
        this.setPage(this.defaultPagination); 
        this.pageLoaderService.refreshPage(false)  
      }
    })

    //setting the page title
    this.titleService.setTitle();

    //fetching the data with default settings
    this.setPage(this.defaultPagination);    
  }  

  ngOnInit() {
    this.titleService.setTitle();//setting page title      
  }
  
  /**
  * Show a popup modal
  * @param index    array index of selected dealership
  * @param dealershipId    id to add legal contacts to specific dealeship
  */
  showCreateLegalContact(index, dealershipId){
   
    this.isCreateContactModalOpened = true;  
    this.legalContactItems = [] 
    this.dealershipId = dealershipId   
    this.legalContactItems =this.dealerships[index]['legal_contacts']

  }

  /**
  * component life cycle default method, runs after view page initlization
  * @return void
  */
  ngAfterViewInit() {
    
    //initializing some jquery neccessary functions
    
    POTENZA.toggleFilters()
    POTENZA.priceslider()
    POTENZA.yearslider()
    POTENZA.tabs()
    
    
    this.listingTable.bodyComponent.updatePage = function(direction: string): void {
      let offset = this.indexes.first / this.pageSize;
      console.log('offset',offset);
      if (direction === 'up') {
        offset = Math.ceil(offset);
      } else if (direction === 'down') {
        offset = Math.floor(offset);
      }

      if (direction !== undefined && !isNaN(offset)) {
        this.page.emit({ offset });
      }
    }
  }

  /**
   * Populate the table with new data based on the page number
   * @param pageInfo The page to select  
   */
  setPage(pageInfo) {      
   
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    if(!this.page.search){
      this.commonUtilsService.showPageLoader();
    }
    
    this.dealershipService.listingDealershipOnDatable(this.page).subscribe(
      //case success
      (pagedData) => {
      
      this.page = pagedData.page;
      this.dealerships = pagedData.data;
      console.log('this.dealerships',this.dealerships);   
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
  onSearch(searchValue : string){
    this.viewedPages = [];
    this.page.search = searchValue
    this.setPage(this.defaultPagination);    
  }

  /**
   * To change the records limit on page
   * @param limit number of records to dispaly on page
   * @return  void
  */
  public onLimitChange(limit: any): void {   
    this.viewedPages = [];
    this.currentPageLimit = this.defaultPagination.limit=this.defaultPagination.pageSize = parseInt(limit) 
    this.setPage(this.defaultPagination);
  }

  /**
   * To sort the records
   * @param event event object which have column name and direction data
   * @return  void
  */
  onSort(event) {
    this.viewedPages = [];
    const sort = event.sorts[0];
    this.page.sortProperty = sort.prop
    this.page.sortDirection = sort.dir   
    this.setPage(this.defaultPagination);  
  }

  /**
     * Remove/delete a dealership
     * @param  item array index     
  */   
 async delete(item){

    //confirm before deleting car
    if(! await this.commonUtilsService.isDeleteConfirmed()) {
      return;
    }
    //console.log(item)
    //console.log('id',item._id)
   // let data = { id:item._id, dealer_id:[localStorage.getItem('loggedinUserId')], }
   let data = { id:item._id, dealer_id:"5ca1e88f9dac60394419c0bc" }
   
    this.dealershipService.removeDealership(data).subscribe(
      (response) => {
      
        var index = this.dealerships.indexOf(item, 0);
          if (index > -1)
          {            
              
              this.ngZone.run( () => {
                this.dealerships.splice(index, 1);  
                this.dealerships = [...this.dealerships]
              });             
             // this.setPage(this.defaultPagination);             
                   
          }
      
      this.commonUtilsService.onSuccess(environment.MESSAGES.RECORD_DELETED); 

    },error => {      
      this.commonUtilsService.onError(error); 
    });
  }  

  /**
   * Filters records when user click on 'Apply Filters' button
   * @return  void
  */
  onApplyingFilters(){
    this.viewedPages = [];
    this.page.filters = this.filtersForm.value
    this.setPage(this.defaultPagination);   
  }  

  /**
  * Show a popup modal
  * @param index    array index of selected dealership/legalcontacts
  * @param type     which modal popup should show
  * Before delete, system confirm to delete the car. If yes opted then process deleting car else no action;
  */
  show(index, type):void {
    this.dealershipItemIndex = index;
    // when add/view Dealership modal is called
    (type=='createDealership' || type=='editDealership')?this.isCreateDealershipModalOpened = true:this.isCreateDealershipModalOpened = false;

    (type=='editDealership')?this.updateExistingDealership = true:this.updateExistingDealership = false;

    this.dealershipsItems = []
  
    if(type=='editDealership'){
      this.dealershipsItems.push(
        this.dealerships[index]
      );
    }  

    // when view Dealership modal is called
    if(type=='viewDealership'){
      this.isDealershipModalOpened = true;
      this.dealershipObject = this.dealerships[index]
    }
    console.log('this.isDealershipModalOpened',this.isDealershipModalOpened);
    // when view Legal Contacts modal is called
    if(type=='viewLegalContacts'){
      this.isModalOpened = true;
      this.dealershipObject = this.dealerships[index]
    }
     
  }  

  /**
   * Check date validations and filters records when select start date filter
   * @return  void
   */
  onStartDateSelected(event:any):void {
    let currentDate = new Date();   
    
    
    this.datesFilter['start']  = new Date(event.year,event.month-1,event.day+1)       
    this.datesFilter['transformedStartDate']  = (this.datesFilter['start']).toISOString();
    
    if((this.datesFilter['start']).getTime() > (currentDate).getTime()){
      this.startDateModel = null
      this.endDateModel = null
      this.commonUtilsService.onError('Start date should not greater than today.');  
      return;      
    }else if(!_.has(this.datesFilter, ['end'])){
      this.datesFilter['end']  = currentDate;
   
      this.datesFilter['transformedEndDate']  = (this.datesFilter['end']).toISOString();
    }

    this.validateDateFilters();       
  }
  /**
   * Check date validations and filters records when select end date filter
   * @return  void
   */
  onEndDateSelected(event:any):void {
    
    this.datesFilter['end']  = new Date(event.year,event.month-1,event.day+1)
   
    this.datesFilter['transformedEndDate']  = (this.datesFilter['end']).toISOString();
    this.validateDateFilters();        
  }

  /**
  * To validate date filters
  * @return  void
  */
  private validateDateFilters(){    




    if(! _.has(this.datesFilter, ['start']))
      this.commonUtilsService.onError('Please select start date');
    else if(! _.has(this.datesFilter, ['end']))
      this.commonUtilsService.onError('Please select end date');
    else if(_.has(this.datesFilter, ['end']) && (this.datesFilter['end']).getTime() < (this.datesFilter['start']).getTime()){
      this.endDateModel = null
      this.commonUtilsService.onError('End date should not less than start date');  
      
    }else{     
      this.page.filters['dates'] = this.datesFilter;
      this.viewedPages = [];
      this.setPage(this.defaultPagination);
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
      this.setPage(this.defaultPagination);
    }
    
  }

  /**
  * Reset modal popup to hide
  * @param isOpened    boolean value 
  * @return void
  */
 hide(isOpened:boolean):void{
  this.isDealershipModalOpened = this.isModalOpened = this.isCreateContactModalOpened = isOpened; //set to false which will reset modal to show on click again
   
 }
 updateDealershipListing(updatedObject){
   console.log('updatedObject',updatedObject);
  let createdAt = this.dealerships[updatedObject.index]['created_at']
  this.dealerships[updatedObject.index] = updatedObject.value
  this.dealerships[updatedObject.index]['created_at'] =createdAt
  this.dealerships = [...this.dealerships]
 }


  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.listingTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}
