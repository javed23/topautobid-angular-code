import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
//import services

//shared services
import { AlertService, PageLoaderService } from '../../../../shared/_services'

//import DealerService 
import { TitleService, DealerService } from '../../../../core/_services';
//import models
import { Page } from "../../../../core/_models";
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

  //title and breadcrumbs
  readonly title: string = 'Dealer My Purchases Listing';
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Dealer My Purchases Listing', link: '' }]

  constructor(private dealerService: DealerService, private titleService: TitleService, private pageLoaderService: PageLoaderService, private toastr: ToastrManager) { }

  ngOnInit() {
    this.getPurchasesList();
  }

  /**
   * get all the delaer purchases list
   */
  private getPurchasesList() {
   this.dealerService.getPurchaseList(this.page).subscribe(res=>{
     console.log('the response from the server is ',JSON.stringify(res))
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
