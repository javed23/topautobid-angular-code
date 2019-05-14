import { Component, OnInit, ViewChild ,ViewEncapsulation} from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
//shared services
import { AlertService, PageLoaderService } from '../../../../shared/_services'
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
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
  encapsulation: ViewEncapsulation.None
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
     * @param pageInfo The page object to select the records
     */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.dealerService.getPurchaseList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.purchases = pagedData.data;
    },
      error => {
        this.toastr.errorToastr(error, 'Oops!');//showing error toaster message
      });
  }


  /**
   * Search results according to user inputs
   * @param searchValue user inputs to search particular data
   * @return  void
   */
  onSearch(searchValue: string) {
    this.page.search = searchValue
    this.setPage(this._defaultPagination);
  }

  viewCarDetails(carId: any) {
    console.log('the car id is ', carId);

  }


  /**
   * download the list of all purchases in csv
   */
  downloadCsv() {

    if (this.purchases.length == 0)
      return

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      showTitle: true,
      title: 'My Purchases List',
      useBom: true,
      headers: ["Ref ", "Bid Date", "Acceptence Date", "Bid Price", "Contacts", "Fee Status"]
    };

    let data = [];
    //iterate purchase list and make custom data
    this.purchases.forEach(purchase => {
      let purchaseObj = {
        car_ref: purchase.car_id.ref,
        bid_date: purchase.bid_date,
        bid_acceptence_date: purchase.bid_acceptance_date,
        price: purchase.price,
        contact: purchase.contact,
        fee_status: purchase.fee_status
      };
      data.push(purchaseObj);
    });

    //pass data and options to download csv
    new Angular5Csv(data, 'My Purchase List', options);
  }


}
