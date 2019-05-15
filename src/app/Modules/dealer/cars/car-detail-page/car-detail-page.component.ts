import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

//modules services, models and enviornment file
import { TitleService, CarService, CommonUtilsService } from '../../../../core/_services'

declare let $: any;
declare let POTENZA: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-car-detail-page',
  templateUrl: './car-detail-page.component.html',
  styleUrls: ['./car-detail-page.component.css']
})
export class CarDetailPageComponent implements OnInit {
  sliderOptions: NgxGalleryOptions[];
  sliderImages: NgxGalleryImage[];


  carDetail: any;
  isImageFilterEnable:Boolean = false
  selectedCategories: any= [] 
  isOpen:boolean=false;

  //title and breadcrumbs
  title: string = 'Car Detail';
  breadcrumbs: any[] = [{ page: 'Home', link: '' }, { page: "Car Listing", link: '/dealer/car-listing' }, { page: 'Car Detail', link: '' }]

  constructor(private activatedRoute: ActivatedRoute, private carService: CarService, private commonUtilsService: CommonUtilsService, private titleService:TitleService) {
    
    //setting the page title
    this.titleService.setTitle();
    this.commonUtilsService.showPageLoader();  

    //hit api to fetch data
    this.carService.carDetail({ id: this.activatedRoute.snapshot.params._id }).subscribe(

      //case success
      (response) => {
        this.carDetail = response     
        this.carDetail.car_images.forEach(element => {
          this.sliderImages.push(
            {
              small: element.file_path,
              medium: element.file_path,
              big: element.file_path,
              label:element.file_category
          }
          )
        });
        this.commonUtilsService.hidePageLoader();
       
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
      }
    );     
    
  }

  ngOnInit() {
    POTENZA.tabs();
    POTENZA.carousel();  
    this.sliderinit();
 

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
    (event.target.checked)?this.selectedCategories.push(event.target.value):_.pullAt(this.selectedCategories,this.selectedCategories.indexOf(event.target.value))
    this.sliderImages = [];
    if(this.selectedCategories.length){
      this.carDetail.car_images.forEach(element => {
        if(_.includes(this.selectedCategories,element.file_category)){
          this.sliderImages.push(
            {
              small: element.file_path,
              medium: element.file_path,
              big: element.file_path,
              label:element.file_category
          }
          )
        }        
      });
    }
    else{
      this.carDetail.car_images.forEach(element => {
        this.sliderImages.push(
          {
            small: element.file_path,
            medium: element.file_path,
            big: element.file_path,
            label:element.file_category
        }
        )
      });
    }
  }

/**
 * Private function to initalize slider 
 * @return  void
*/
  private sliderinit():void{
    this.sliderOptions = [
      {
          width: '100%',
          height: '365px',     
          imageAnimation: NgxGalleryAnimation.Slide,
          imageArrowsAutoHide:true,          
          thumbnailsArrows:true,
          thumbnailsColumns:5,
          thumbnailMargin: 2,
          thumbnailsPercent:20,
          imageInfinityMove:true,
          thumbnailsAutoHide:true,
          closeIcon:'fa fa-times'
         
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsMargin: 20,
          thumbnailMargin: 20,
           
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
    ];  
    this.sliderImages = [];
  }

/**
* Show a popup modal 
*/
show():void {
  this.isOpen = true;  
}
 /**
  * Reset modal popup to hide
  * @param isOpened    boolean value 
  * @return void
  */
 hide(isOpened:boolean):void{
  this.isOpen = isOpened; //set to false which will reset modal to show on click again
}


}
