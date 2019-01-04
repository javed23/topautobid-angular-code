import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { AbstractControl,  FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { Router} from "@angular/router";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//import core services
import { UserAuthService } from '../../../core/_services'


//import core services
import { CustomValidators } from '../../../core/custom-validators';

declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  title:string = 'Register';
  breadcrumbs:any = [{page:'Home',link:''},{page:'Register',link:''}]
  signupForm: FormGroup;
  submitted = false;
  

  constructor( private modalService: NgbModal, private _location: Location, private alertService:AlertService, private userAuthService:UserAuthService, private pageLoaderService:PageLoaderService, private formBuilder: FormBuilder, private router: Router) { 
    var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    this.signupForm = this.formBuilder.group({  
      name:this.formBuilder.group({
        prefix: ['Mr.'],
        first_name: [''],
        last_name: ['']
       
      }),
      email: ['', [Validators.email,Validators.required],this.isEmailUnique.bind(this)],
      phone: ['', Validators.compose([
              Validators.required,            
              // check whether the entered password has a special character
              CustomValidators.patternValidator(
                /[ d{3}-\d{3}-\d{4} ]/,
                {
                  validPhone: true
                }
              ),       
            ])      
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          /*
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),*/
          Validators.minLength(8)
        ])
      ],
      repassword: ['', Validators.compose([Validators.required])],
      model:['Seller']
    },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    }
  ); 
  //this.signupForm.controls['email'].setAsyncValidators(CustomValidators.emailExist(this.authService, this.email));
  }


  

  
  verifyPhone(content) {
    console.log('content:'+content);
    this.modalService.open(content, { size: 'sm' });
  }
  isEmailUnique(control: AbstractControl) {
    return this.userAuthService.emailExist({email:control.value, model:'Seller'}).map(res => {
      return (res.status==200) ? { emailTaken: true } : null ;
    });
  }

  

  ngOnInit() {
    POTENZA.scrolltotop()
  }

  goBack() {
    POTENZA.scrolltotop()
    this._location.back();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
        return;
    }
    console.log(this.signupForm.value)
    this.pageLoaderService.pageLoader(true);
    this.userAuthService.sellerSignup(this.signupForm.value)
        //.pipe(first())
        .subscribe(
            (data) => {
              this.pageLoaderService.pageLoader(false);
                if(data.status==200){                     
                  var userData =  data.data;  
                       
                  localStorage.setItem('loggedinUser',JSON.stringify(userData))
                  this.userAuthService.isLoggedIn(true);                  
                  this.router.navigate(['/seller/home']);
                }else{    
                  this.alertService.setAlert('error',data.error); 
                }
            },
            error => {
                this.pageLoaderService.pageLoader(false);
                this.alertService.setAlert('error','System got error');
                
            });
  }


}
