import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import services

//shared services
import { AlertService, PageLoaderService } from '../../../../shared/_services'

//import DealerService 
import { TitleService, DealerService } from '../../../../core/_services';
//import models
import { Page,Purchase } from "../../../../core/_models";
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
  coulumns= [{name:'Name'},{name:'Gender'},{name:'Company'}];

  //title and breadcrumbs
  readonly title: string = 'Dealer My Purchases Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dealer My Purchases Listing', link: '' }];

  constructor(private dealerService: DealerService, private titleService: TitleService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager) {

    this.page.pageNumber = 0;
    this.page.size = 20;
   }

  ngOnInit() {
  
    this.setPage({ offset: 0 });
    this.getPurchasesList();
  }

/**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo){
    this.page.pageNumber = pageInfo.offset;
    this.dealerService.getPurchaseList(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.purchases = pagedData.data;
    });
  }






  
  /**
   * get all the delaer purchases list
   */
  private getPurchasesList() {
   this.dealerService.getPurchaseList(this.page).subscribe(res=>{
     console.log('the response from the server is ',JSON.stringify(res))
     this.purchases = res.data;
     console.log('the data after purchase is',this.purchases);
   })
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
