import { Component, OnInit } from '@angular/core';

declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title:string = 'Cars Listing';
  breadcrumbs:any = [{page:'Home',link:''},{page:'Cars Listing',link:''}]

  constructor() { }

  ngOnInit() {
    POTENZA.scrolltotop()
  }

}
