import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //define default emails and phones formArrayName 
  data = {
    phones: [
      {
        phone: "",
        default_phone: ""
      }
    ],
    emails: [
      {
        email: "",
        default_email: ""
      }
    ]
  }


  //define the component properties
  title:string = 'Profile';
  breadcrumbs:any = [{page:'Home',link:'#'},{page:'Profile',link:''}]
  profileForm: FormGroup;
  submitted = false;


  constructor(private formBuilder: FormBuilder, private translate: TranslateService) { 
    
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
 
    // the lang to use, if the lang isn't available, it will use the current loader to get them
   this.translate.use('en');

   //define the login form and its controls
    this.profileForm = this.formBuilder.group({    
      prefix: ['Mr.'],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],  
      phones: this.formBuilder.array([], Validators.required),
      default_phone: [''], 
      emails: this.formBuilder.array([], Validators.required),
      default_email: [''],   
    })  
    
  }

 

  ngOnInit() {
    this.setPhones();
    this.setEmails();
    this.profileForm.get('phones').valueChanges.subscribe(
      data => {
        let selectedDefaultPhones = data.filter((l) => l.default_phone).map((l) => l);
        if(selectedDefaultPhones.length<=0){
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneNotSelected': true });
        }else if(selectedDefaultPhones.length >1){
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneMaxSelected': true });
        }else{
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneMaxSelected': null });
          this.profileForm.get('default_phone').setErrors({ 'defaultPhoneNotSelected': null });
        }        
      }
    );

    this.profileForm.get('emails').valueChanges.subscribe(
      data => {
        let selectedDefaultEmails = data.filter((l) => l.default_email).map((l) => l);
        if(selectedDefaultEmails.length<=0){
          this.profileForm.get('default_email').setErrors({ 'defaultEmailNotSelected': true });
        }else if(selectedDefaultEmails.length >1){
          this.profileForm.get('default_email').setErrors({ 'defaultEmailMaxSelected': true });
        }else{
          this.profileForm.get('default_email').setErrors({ 'defaultEmailMaxSelected': null });
          this.profileForm.get('default_email').setErrors({ 'defaultEmailNotSelected': null });
        }        
      }
    );
  }


  cloneEmail(){ 
    let control = <FormArray>this.profileForm.controls.emails;
    control.push(
      this.formBuilder.group({
        email: ['', [Validators.required]],
        default_email: [''],
      })
    )
  }
  removeEmail(index) {    
    let control = <FormArray>this.profileForm.controls.emails;
    control.removeAt(index)
  }
  setEmails() {
    let control = <FormArray>this.profileForm.controls.emails;
    this.data.emails.forEach(x => {
      control.push(this.formBuilder.group({ 
        email: ['', [Validators.required]],
        default_email: [''],
       })
      )
    })
  }


  clonePhone(){    
    let control = <FormArray>this.profileForm.controls.phones;
    control.push(
      this.formBuilder.group({
        phone: ['', [Validators.required]],
        default_phone: [''],
      })
    )
  }
  removePhone(index) {
    let control = <FormArray>this.profileForm.controls.phones;
    control.removeAt(index)
  }
  
  setPhones() {
    let control = <FormArray>this.profileForm.controls.phones;
    this.data.phones.forEach(x => {
      control.push(this.formBuilder.group({ 
        phone: ['', [Validators.required]],
        default_phone: [''],
       })
      )
    })
  }
  

  onSubmit() {
    this.submitted = true;
    
    
    // stop here if form is invalid
    if (this.profileForm.invalid) {
        return;
    }    
  }


}
