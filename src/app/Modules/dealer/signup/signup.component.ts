import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  title:string = 'Register';
  breadcrumbs:any = [{page:'Home',link:'#'},{page:'pages',link:'#'},{page:'Register',link:''}]

  constructor() { }

  ngOnInit() {
  }

}
