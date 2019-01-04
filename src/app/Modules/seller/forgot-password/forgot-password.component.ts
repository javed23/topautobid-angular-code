import { Component, OnInit } from '@angular/core';
import { AbstractControl,  FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router} from "@angular/router";

//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//import core services
import { UserAuthService } from '../../../core/_services'


declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  //define the component properties
  title:string = 'Forgot Password';
  breadcrumbs:any = [{page:'Home',link:'#'},{page:'Login',link:'/seller/login'},{page:'Forgot password',link:''}]
  forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(private translate: TranslateService,private alertService:AlertService, private userAuthService:UserAuthService, private pageLoaderService:PageLoaderService, private formBuilder: FormBuilder, private router: Router) { 
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
 
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    this.forgotPasswordForm = this.formBuilder.group({     
        email: ['', [Validators.email,Validators.required],this.isEmailExist.bind(this)],     
        model:['Seller']
      }
    ); 
  }

  ngOnInit() {
  }

  isEmailExist(control: AbstractControl) {
    return this.userAuthService.emailExist({email:control.value, model:'Seller'}).map(res => {
      return (res.status==200) ? null : { emailNotExist: true } ;
    });
  }

  

  onSubmit() {
    this.submitted = true;
    
    
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
        return;
    }    
  }

}
