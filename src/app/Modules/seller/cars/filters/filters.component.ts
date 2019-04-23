import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filtersForm:FormGroup;
  @Input('page') page
  @Input('isOpen') isOpen;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
     //calling filters form initlization method
     this.initalizeFilterForm();
  }

/**
* initializing filters form 
* @return void
*/
  private initalizeFilterForm():void {
    this.filtersForm = this.formBuilder.group({
      bid: ['$1 - $1000'],
      years:['2010 - 2018']      
    })
  }

/**
 * Filters records when user click on 'Apply Filters' button
 * @return  void
*/
  onApplyingFilters():void { 
   
    let values = this.filtersForm.value
    this.page.filters['bid'] = (values.bid).replace(/ /g,'').split('-');
    this.page.filters['years'] = (values.years).replace(/ /g,'').split('-');  
  }
}
