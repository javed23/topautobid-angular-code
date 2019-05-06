import { Component, ViewChild, Output, Input,  EventEmitter, ElementRef } from '@angular/core';
declare let $: any;
declare let POTENZA: any;

@Component({
  selector: 'app-car-view',
  templateUrl: './car-view.component.html',
  styleUrls: ['./car-view.component.css']
})
export class CarViewComponent{
  @Input() carObject:any
  @Input() isOpen: any;
  @ViewChild('carViewSection') carViewSection :ElementRef;

  /**
  * component life cycle default method, runs when input value named 'isOpen' gets change
  * @return void
  */
  ngOnChanges():void {

    if(this.isOpen){

      //to show the modal popup
      $(this.carViewSection.nativeElement).modal('show'); 

      //call image slider to load images dynamically
      setTimeout(function () {
        POTENZA.slickslider()
      }, 500);

    }
      

  }

}
