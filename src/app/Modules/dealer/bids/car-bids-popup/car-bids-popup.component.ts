import { Component, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, Input,  ElementRef } from '@angular/core';
//import Service 
import { CommonUtilsService, CarService  } from '../../../../core/_services'

//import models
import {  Bid } from "../../../../core/_models";
declare let $: any;
@Component({
  selector: 'app-car-bids-popup',
  templateUrl: './car-bids-popup.component.html',
  styleUrls: ['./car-bids-popup.component.css']
})
export class CarBidsPopupComponent {

  @Input() isOpen: any;
  @Input() carId: any;
  @ViewChild('contentSection') contentSection :ElementRef;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  
  bids:any;
  constructor(private carService: CarService, private commonUtilsService:CommonUtilsService) { }

  /**
  * component life cycle default method, runs when input value named 'isOpen' gets change
  * @return void
  */
 
  ngOnChanges():void{
    console.log('chanhge',this.isOpen);
    //to show the modal popup
    if(this.isOpen) {
      this.commonUtilsService.showPageLoader();
      this.carService.listingCarBids({ id:this.carId }).subscribe(pagedData => {
    
        this.bids = pagedData;  
        this.commonUtilsService.hidePageLoader();
        console.log('bids',this.bids)
      },
      error => {
        this.commonUtilsService.onError(error);
      });

      $(this.contentSection.nativeElement).modal('show'); 
    }
  }

  /**
  * function to close the popup and emit response to onClose event
  * @return void
  */
  close() {
    this.isOpen = false
    this.onClose.emit(false);    
  }

}
