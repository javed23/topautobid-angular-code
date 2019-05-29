import { Component, OnInit, ViewChild,  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService  } from '../../../../core/_services'
import { PagedData, Car, Page } from "../../../../core/_models";
import { environment } from '../../../../../environments/environment'



@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  sectionEnable:string='list'

  page = new Page(); //object of Page type  
  cars = new Array<Car>() //array of Car type 

  currentPageLimit: number = environment.DEFAULT_RECORDS_LIMIT  
  private _defaultPagination = {
    count: 0,
    limit: this.currentPageLimit,
    offset: 1,
    pageSize: this.currentPageLimit
  }
  //title and breadcrumbs
  readonly title: string = 'Car Listing'
  readonly breadcrumbs: any[] = [{ page: 'Home', link: '/dealer/home' }, { page: 'Car Listing', link: '' }]


  constructor(private commonUtilsService:CommonUtilsService, private carService: CarService, private formBuilder: FormBuilder, private titleService:TitleService) {
 

    //setting the page title
    this.titleService.setTitle();

    this.setPage(this._defaultPagination);  
  }

  setPage(page) {
    this.page.size = this.currentPageLimit,
    //hit api to fetch data
    this.carService.listingCarsOnDatable(this.page).subscribe(

      //case success
      (pagedData) => {      
      
      this.page = pagedData.page;
     
      //this.cars =  pagedData.data; 
      this.cars =  [...pagedData.data];   

      this.commonUtilsService.hidePageLoader();
    //case error 
    },error => {
      this.commonUtilsService.onError(error);
    });
  }

  show(type){
    this.sectionEnable = type
    console.log('sectionEnable',this.sectionEnable);
  }

  ngOnInit() {
  }

}
