import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];


  carDetail: any;
  isImageFilterEnable:Boolean = false
  selectedCategories: any= []
  allCategoryCars:any = []
  

  title: string = 'Car Detail';
  breadcrumbs: any[] = [{ page: 'Home', link: '' }, { page: "Car Listing", link: '/dealer/car-listing' }, { page: 'Car Detail', link: '' }]

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private carService: CarService, private commonUtilsService: CommonUtilsService, private titleService:TitleService) {
    
    //setting the page title
    this.titleService.setTitle();

    this.commonUtilsService.showPageLoader();

    if('type' in this.activatedRoute.snapshot.params){
      console.log('breadcrumbs');
      this.breadcrumbs = [{ page: 'Home', link: '' }, { page: "Dashboard", link: '/seller/car-dashboard' }, { page: 'Car Detail', link: '' }]
    }
    //hit api to fetch data
    this.carService.carDetail({ id: this.activatedRoute.snapshot.params._id }).subscribe(

      //case success
      (response) => {
        this.carDetail = response     
      
        this.allCategoryCars = this.carDetail.car_images
        this.carDetail.car_images.forEach(element => {
          this.galleryImages.push(
            {
              small: element.file_path,
              medium: element.file_path,
              big: element.file_path,
              label:element.file_category
          }
          )
        });
        this.commonUtilsService.hidePageLoader();
        setTimeout(function () {
          POTENZA.slicksliderRecent()
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
    (event.target.checked)?this.selectedCategories.push(event.target.value):_.pullAt(this.selectedCategories,this.selectedCategories.indexOf(event.target.value))
  
    if(this.selectedCategories.length){
      this.carDetail.car_images.forEach(element => {
        if(_.includes(this.selectedCategories,element.file_category)){
          this.galleryImages.push(
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
        this.galleryImages.push(
          {
            small: element.file_path,
            medium: element.file_path,
            big: element.file_path,
            label:element.file_category
        }
        )
      });
    }
      

 
      this.destorySliderReinit()

  }
/**
 * Private function to destroy anf re-initalize slick slider 
 * @return  void
*/
  private destorySliderReinit():void{
    $(".slider-for").slick('destroy');      
      $(".slider-nav").slick('destroy');
      setTimeout(function () {
        POTENZA.slicksliderRecent()
        }, 500);
  }

  ngOnInit() {
    POTENZA.tabs();
    POTENZA.carousel();  
    
    
    this.galleryOptions = [
      {
          width: '100%',
          height: '490px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
  ];
  console.log('this.galleryImages',typeof this.galleryImages)
  this.galleryImages = [];
  console.log('this.galleryImages',typeof this.galleryImages)

  } 
}
