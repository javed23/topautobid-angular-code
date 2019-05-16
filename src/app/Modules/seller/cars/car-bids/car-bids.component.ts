import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { CarService } from '../../../../core/_services/car.service';
declare let $: any;

@Component({
  selector: 'app-car-bids',
  templateUrl: './car-bids.component.html',
  styleUrls: ['./car-bids.component.css']
})
export class CarBidsComponent {
  @Input() isOpen: any;
  @Input() carId: any;
  bids: any =[];
  @ViewChild('contentSection') contentSection: ElementRef;
  constructor(private carService: CarService) {

  }
  /**
  * component life cycle default method, runs when input value named 'isOpen' gets change
  * @return void
  */
  ngOnChanges(): void {

    //to show the modal popup
      this.carService.getCarBids(this.carId).subscribe((response) => {
        console.log('the bids are ');
        this.bids = response;
      })

      if (this.isOpen) $(this.contentSection.nativeElement).modal('show');
    }

}
