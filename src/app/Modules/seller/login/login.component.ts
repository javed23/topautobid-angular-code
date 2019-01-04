import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl,  FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { Router} from "@angular/router";
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';


//import shared services
import { AlertService, PageLoaderService } from '../../../shared/_services'

//import core services
import { UserAuthService } from '../../../core/_services'

declare var jQuery:any;
declare var $:any;
declare var POTENZA:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title:string = 'Login';
  breadcrumbs:any = [{page:'Home',link:''},{page:'Login',link:''}]
  loginForm: FormGroup;
  submitted = false;

  constructor( private authService: AuthService, private alertService:AlertService, private userAuthService:UserAuthService, private pageLoaderService:PageLoaderService, private translate: TranslateService, private formBuilder: FormBuilder, private router: Router) { 
    this.loginForm = this.formBuilder.group({      
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],  
      remember_me: [''],
      model:['Seller']
    });
    //this.translate.setDefaultLang('en');
    this.translate.use('en');
    //this.pageLoaderService.pageLoader(true);
  }


  ngOnInit() {    
    POTENZA.scrolltotop()
  }

  //social logins methods
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.pageLoaderService.pageLoader(true);
    this.userAuthService.checkLogin(this.loginForm.value)
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
