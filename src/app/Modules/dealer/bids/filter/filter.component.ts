import { Component, OnInit,Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonUtilsService } from '../../../../core/_services'

declare let jQuery: any;
declare let $: any;
declare let POTENZA: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() filters:any
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  filtersForm:FormGroup;
  yearsRange:any=[]
  makes:any =[]
  models:any=[]
  trims:any=[]
  states:any=[]
  bodystyles:any=[]
  interiorColors= [{name: "Black"}, {name: "Blue"}, {name: "Brown"}, {name: "Grey"}, {name: "Red"}, {name: "Silver"}];
  exteriorColors= [{name: "Black"}, {name: "Blue"}, {name: "Brown"}, {name: "Grey"}, {name: "Red"}, {name: "Silver"}];
  carConditions:any = ['Ready For Resale Without Any Reconditioning','May Need Some Reconditioning','Needs Some Reconditioning But Yet Functional','Parts Only']
  interiorMaterials= [{name: "Faux Leather"}, {name: "Brushed Nylon"}, {name: "Nylon Fabric"}];
  radius:any = [ 25, 50, 100, 150, 200, 250]

  constructor(private commonUtilsService: CommonUtilsService, private formBuilder: FormBuilder) { 
   
    this.commonUtilsService.showPageLoader();
    this.commonUtilsService.listingMakes().subscribe(
      //case success
      (data) => {      
        this.makes = data
        this.commonUtilsService.hidePageLoader();
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
    });


    this.commonUtilsService.getStates().subscribe(
      //case success
      (data) => {      
        this.states = data
        this.commonUtilsService.hidePageLoader();
        //case error 
      }, error => {
        this.commonUtilsService.onError(error);
    });
  } 

/**
* initializing filters form 
* @return void
*/
private initalizeFilterForm():void {
  let currentYear = new Date().getFullYear();
  this.filtersForm = this.formBuilder.group({
    vin_license_plate:[''],
    reserve_not_met:[''], 
    radius:[''],
    make:[''],
    model:[''],
    selectedmake:[''],
    selectedmodel:[''],
    trim:[''],
    
    state:[''],
    condition:[''],
    interior_color:[''],
    exterior_color:[''], 
    mileagerange: ['1 Mi - 10,000 Mi'],
    yearrange:[`2010 - ${currentYear}`],
    year_range:'' ,
    mileage_range:''  
  })
}

/**
* Filters records when user click on 'Apply Filters' button
* @return  void
*/
private onApplyingRangeFilters():void { 

  let componentRefrence = this //assign the component object to use with jquery 
  
  //when we stop price slider
  $( "#mileage-range" ).on( "slidestop", function( event, ui ) {     
    componentRefrence.filtersForm.get('mileage_range').patchValue([ui.values[0],ui.values[1]])  
     
  });

  //when we stop year slider
  $( "#year-range" ).on( "slidestop", function( event, ui ) {
    
    componentRefrence.filtersForm.get('year_range').patchValue([ui.values[0],ui.values[1]])   
   
  });

  $( "#year-range" ).on( "slide", function( event, ui ) {       
    componentRefrence.filtersForm.get('yearrange').patchValue(`${ui.values[0]} - ${ui.values[1]}`)        
  });
  $( "#mileage-range" ).on( "slide", function( event, ui ) {       
    componentRefrence.filtersForm.get('mileagerange').patchValue(`${ui.values[0]} Mi - ${ui.values[1]} Mi`)       
  });

}


  ngOnInit() {
    
    let currentYear = new Date().getFullYear(); 
    for (var i = 0; i < 15; i++) {
      this.yearsRange.push({
        label: currentYear - i,
        value: currentYear - i
      });
    }

    //calling filters form initlization method
    this.initalizeFilterForm();

    this.filtersForm.patchValue(this.filters)
    POTENZA.mileageSlider()
    POTENZA.yearslider()
    this.onApplyingRangeFilters()
   } 

  listingModel(event){
    console.log(event.target.options[event.target.selectedIndex].getAttribute('data-makeName'))
    
    if(event.target.value){
      this.commonUtilsService.showPageLoader();
      this.commonUtilsService.listingModels({ make_id:event.target.value}).subscribe(
        //case success
        (data) => {                
          this.models = data
          this.commonUtilsService.hidePageLoader();
          //case error 
        }, error => {
          this.commonUtilsService.onError(error);
      });
    }
    this.filtersForm.get('selectedmake').patchValue([event.target.options[event.target.selectedIndex].getAttribute('data-makeName')])
  }

  listingTrim(event){
    console.log(event.target.value)
    this.trims = []
    this.bodystyles = []
    
    if(event.target.value){
      this.commonUtilsService.showPageLoader();
      this.commonUtilsService.listingTrimsWithBodystyles({ model_id:event.target.value}).subscribe(
        //case success
        (data) => {  
  
          this.trims = data.trims
          this.bodystyles = data.bodystyles
          this.commonUtilsService.hidePageLoader();
          //case error 
        }, error => {
          this.commonUtilsService.onError(error);
      });
    }
    this.filtersForm.get('selectedmodel').patchValue([event.target.options[event.target.selectedIndex].getAttribute('data-modelName')])
  }


  applyFilters(){
    console.log(this.filtersForm.value)
    let yearRangeObject = (this.filtersForm.get('yearrange').value).split(" - ")
    console.log('yearRangeObject',yearRangeObject)
    this.filtersForm.get('year_range').patchValue([yearRangeObject[0],yearRangeObject[1]])
    this.onSubmit.emit(this.filtersForm.value); 
  }
  multipleSelection(event,formcontrolName){
    console.log('value',(event.target.value).split(": "))
    let selection = (event.target.value).split(": ")   
    console.log('selection',selection[1].slice(1, -1)); 
    if(selection[1].slice(1, -1).length<=0){ 
      this.filtersForm.get(formcontrolName).patchValue('')
      console.log(this.filtersForm.value);
    }
  }  

}
