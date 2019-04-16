import { Component,SimpleChanges, ViewChild, OnInit, Input,  ElementRef } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-dealership-view',
  templateUrl: './dealership-view.component.html',
  styleUrls: ['./dealership-view.component.css']
})
export class DealershipViewComponent implements OnInit {
  @Input() isOpen: any;
  @Input() dealershipObject: any;
  @ViewChild('contentSection') contentSection :ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.isOpen)
      $(this.contentSection.nativeElement).modal('show'); 

  }

}