import { Component, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, Input,  ElementRef } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

declare let $: any;

@Component({
  selector: 'app-car-payments-popup',
  templateUrl: './car-payments-popup.component.html',
  styleUrls: ['./car-payments-popup.component.css']
})
export class CarPaymentsPopupComponent implements OnInit {


  @Input() isOpen: any;
  @Input() selectedCarDetails: any;
  @ViewChild('contentSection') contentSection :ElementRef;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  public payPalConfig?: IPayPalConfig;
  constructor() { }

  ngOnInit() {
    this.initConfig();
    //$(this.contentSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true}); 
  }

  /**
  * component life cycle default method, runs when input value named 'isOpen' gets change
  * @return void
  */
 
  ngOnChanges():void{
    //console.log('selectedCarDetails',this.selectedCarDetails);
    //console.log('price', this.selectedCarDetails.my_bid[0].price)
    //to show the modal popup
    if(this.isOpen) {
      $(this.contentSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true}); 
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AQfA5nzAx7WkixB5bANwwv5wd--9KYCniND-qpUeHtdKGi9pHNnsFYeejAyNr6ovYpDd8iHXDc7hwIXi',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.selectedCarDetails.my_bid[0].price,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.selectedCarDetails.my_bid[0].price,
                }
              }
            },
            items: [
              {
                name: this.selectedCarDetails.vin,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: this.selectedCarDetails.my_bid[0].price,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
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
