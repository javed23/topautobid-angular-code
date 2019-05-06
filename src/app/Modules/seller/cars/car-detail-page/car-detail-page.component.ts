import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService } from '../../../../core/_services'

declare let $: any;
declare let POTENZA: any;

@Component({
  selector: 'app-car-detail-page',
  templateUrl: './car-detail-page.component.html',
  styleUrls: ['./car-detail-page.component.css']
})
export class CarDetailPageComponent implements OnInit {
  carDetail: any;
  isImageFilterEnable:Boolean = false

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private carService: CarService, private commonUtilsService: CommonUtilsService) {
    
    this.commonUtilsService.showPageLoader();

    //hit api to fetch data
    this.carService.carDetail({ id: this.activatedRoute.snapshot.params._id }).subscribe(

      //case success
      (response) => {
        this.carDetail = response
        this.commonUtilsService.hidePageLoader();
        setTimeout(function () {
          POTENZA.slickslider()
        }, 500);
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      }
    );   
  }

  /**
   * Function to back the control on listin page
   * @return  void
  */
  backToListPage():void {
    this.location.back();
  }


/**
 * Function to show/hide the image filters
 * @return  void
*/
  imageFilterToggle():void{
    this.isImageFilterEnable = (this.isImageFilterEnable)?false:true
  }

/**
 * Function to filter image in slider
 * @param   event object 
 * @return  void
*/
  onImageFilter(event):void{
    console.log(event.target.value)
  }

  ngOnInit() {
    POTENZA.tabs();   
    
  } 
}
