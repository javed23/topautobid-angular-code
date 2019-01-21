import { Component, OnInit, ElementRef, Inject } from '@angular/core';

declare var jQuery: any;
declare var $: any;
declare var POTENZA: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  elementRef: ElementRef;
  slideValue: number = 0;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    POTENZA.Isotope(),
    POTENZA.masonry();
    this.elementRef = elementRef;
  }

  ngOnInit() {
    
    POTENZA.counters()
    POTENZA.carousel()
    POTENZA.scrolltotop()
    POTENZA.revolutionSlider(jQuery)
    
  }

}
