import { Component, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, Input,  ElementRef } from '@angular/core';
//import Service 
import { CommonUtilsService, CarService,SellerService  } from '../../../../core/_services'

//import models
import {  Bid } from "../../../../core/_models";
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';
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
  @Output() onAccept: EventEmitter<any> = new EventEmitter<any>();
  bidId:any;
  bids:any;
  constructor(private sellerService:SellerService,private carService: CarService, private commonUtilsService:CommonUtilsService) { }

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
     console.log('here i am')
      $(this.contentSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true}); 
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


 /**
   * accept bid will be invoked on accepting the bid
   * @param bidId is the bid id 
   */
  acceptBid(bidId: any): void {
    console.log('the bid id is', bidId);
    this.bidId = bidId;
    Swal.fire({
      title: 'Are you sure you want to accept this bid? ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {

        this.submitBid();

      
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      }
    })
  };



  /**
   * will invoke when you confirm that accept the bid
   */
  private submitBid(): void {
    let obj = {
      bidId: this.bidId,
      carId:this.carId
    };
    this.sellerService.acceptBid(obj).subscribe(response => {
      // console.log('');
     
         this.commonUtilsService.onSuccess(environment.MESSAGES.BID_ACCEPTED)
        // this.setPage(this._defaultPagination);
        this.isOpen = false;
        $(this.contentSection.nativeElement).modal('hide')
        this.onAccept.emit(true);
    },error=>{
      this.commonUtilsService.onError(error)
    })
  }
}
