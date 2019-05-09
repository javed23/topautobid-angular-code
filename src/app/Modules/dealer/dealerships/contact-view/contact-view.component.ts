import { Component, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, Input,  ElementRef } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-contact-view',
  templateUrl: './contact-view.component.html',
  styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {

  @Input() isOpen: any;
  @Input() dealershipObject: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('legalContactsSection') legalContactsSection :ElementRef;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {

    if(this.isOpen)
      $(this.legalContactsSection.nativeElement).modal({backdrop: 'static', keyboard: false, show: true}); 

  }
  close() {
    this.isOpen = false
    this.onClose.emit(false);    
  }
  ngOnInit() {
    
  }
 
}
