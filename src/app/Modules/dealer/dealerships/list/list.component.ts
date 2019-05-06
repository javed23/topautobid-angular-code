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
  @ViewChild('myTable') table; 
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
  readonly title: string = 'Dealerships Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dealerships Listing', link: '' }]
   
  constructor(private http: HttpClient, private titleService:TitleService,private commonUtilsService:CommonUtilsService, private dealershipService: DealershipService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager, private formBuilder: FormBuilder, private zone: NgZone) {
    this.pageLoaderService.shouldPageLoad.subscribe((SholdPageRefresh: boolean) => {
      console.log('SholdPageRefresh',SholdPageRefresh);
      if(SholdPageRefresh){
        this.viewedPages = [];
        this.setPage(this.defaultPagination); 
        this.pageLoaderService.refreshPage(false)  
      }
    })

    

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
    
    
    this.table.bodyComponent.updatePage = function(direction: string): void {
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
    //console.log('viewedPages',this.viewedPages);
    if( _.includes(this.viewedPages, this.page.pageNumber))
      return;
    else    
      this.viewedPages.push(this.page.pageNumber)

    if(!this.page.search){
      this.pageLoaderService.setLoaderText(environment.MESSAGES.FETCHING_RECORDS);//setting loader text
      this.pageLoaderService.pageLoader(true);//show page loader
    }
    
    this.dealershipService.listingDealerships(this.page).subscribe(
      (pagedData) => {
      
      this.page = pagedData.page;

      let dealerships = this.dealerships;
      if (dealerships.length !== pagedData.page.totalElements) {
        dealerships = Array.apply(null, Array(pagedData.page.totalElements));
        
        dealerships = dealerships.map((x, i) => this.dealerships[i]);
      }

      // calc start
      const start = this.page.pageNumber * this.page.size;
      
      // set dealerships to our new dealerships
      pagedData.data.map((x, i) => dealerships[i + start] = x);
      this.dealerships = dealerships;
      console.log('this.dealerships',this.dealerships);
   
      this.pageLoaderService.pageLoader(false);//show page loader
      this.pageLoaderService.setLoaderText('');//setting loader text
    

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
    //console.log('viewedPages',this.viewedPages);
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
  delete(item){
    if(! confirm("Are you sure to delete this record ?")) {
      return;
    }
    //console.log(item)
    //console.log('id',item._id)
    let data = { id:item._id, dealer_id:[localStorage.getItem('loggedinUserId')], }
    this.dealershipService.removeDealership(data).subscribe(
      (response) => {
      
        var index = this.dealerships.indexOf(item, 0);
          if (index > -1)
          {
              this.dealerships.splice(index, 1);              
              //console.log(this.dealerships);     
                   
          }
      
      this.pageLoaderService.pageLoader(false);//show page loader
      this.pageLoaderService.setLoaderText('');//setting loader text
      this.toastr.successToastr(environment.MESSAGES.RECORD_DELETED, 'Success!'); //showing success toaster 

    },error => {

      this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
      this.pageLoaderService.pageLoader(false);//hide page loader
      this.toastr.errorToastr(error, 'Oops!');//showing error toaster message

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

    // when view Legal Contacts modal is called
    if(type=='viewLegalContacts'){
      this.isModalOpened = true;
      this.dealershipObject = this.dealerships[index]
    }
     
  }  

  // This method must be present, even if empty.
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }

}