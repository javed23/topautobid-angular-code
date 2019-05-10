import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import services

//shared services
import { AlertService, PageLoaderService } from '../../../../shared/_services'

//import DealerService 
import { TitleService, DealerService } from '../../../../core/_services';
//import models
import { Page, Purchase } from "../../../../core/_models";

import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.css'],
  providers: [
    DealerService
  ],
})
export class PurchasesListComponent implements OnInit {
  @ViewChild('myTable') table;
  page = new Page();
  purchases = new Array<Purchase>()


  //title and breadcrumbs
  readonly title: string = 'Dealer My Purchases Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dealer My Purchases Listing', link: '' }];

  //Defined records limit and records limit options
  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT
  readonly pageLimitOptions = environment.DEFAULT_PAGE_LIMIT_OPTIONS
  constructor(private dealerService: DealerService, private titleService: TitleService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager) {

    this.page.pageNumber = 0;
    this.page.size = 2;
  }

  //default pagination settings
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 0,
    pageSize: this.currentPageLimit
  }
  ngOnInit() {

    this.setPage(this._defaultPagination);
    // this.getPurchasesList();
  }
  /**
   * To change the records limit on page
   * @param limit number of records to dispaly on page
   * @return  void
   */

  onLimitChange(limit: any): void {
    this.currentPageLimit = this._defaultPagination.limit = this._defaultPagination.pageSize = parseInt(limit)
    this.setPage(this._defaultPagination);
  }



  /**
     * Populate the table with new data based on the page number
     * @param page The page to select
     */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.dealerService.getPurchaseList(this.page).subscribe(pagedData => {
    this.page = pagedData.page;
    this.purchases = pagedData.data;
    },
    error=>{
      this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
    });
  }


  /**
   * Search results according to user inputs
   * @param searchValue user inputs to search particular data
   * @return  void
   */
  onSearch(searchValue: string) {
    // this.viewedPages = [];
    this.page.search = searchValue
    // this.setPage(this.defaultPagination);    
  }


}
