import { Component,  ViewChild, Input,  ElementRef } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-car-bids',
  templateUrl: './car-bids.component.html',
  styleUrls: ['./car-bids.component.css']
})
export class CarBidsComponent{
  @Input() isOpen: any;
  @Input() carObject: any;
  @ViewChild('contentSection') contentSection :ElementRef;

  /**
  * component life cycle default method, runs when input value named 'isOpen' gets change
  * @return void
  */
  ngOnChanges():void{

    //to show the modal popup
    if(this.isOpen) $(this.contentSection.nativeElement).modal('show'); 
  }

}
