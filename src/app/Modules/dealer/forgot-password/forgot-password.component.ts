import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';

//import services
  //import shared 
  import { AlertService, PageLoaderService } from '../../../shared/_services'

  //import module services
  import { UserAuthService, TitleService } from '../../../core/_services'

import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild("contentSection") contentSection: ElementRef;
  //define the component properties
  title: string = 'Dealer Forgot Password';
  breadcrumbs: any[] = [{ page: 'Home', link: '#' }, { page: 'Login', link: '/dealer/login' }, { page: 'Forgot password', link: '' }]
  forgotPasswordForm: FormGroup;
  submitted: boolean = false;
  forgotPasswordSubscription: Subscription;

  constructor(private alertService: AlertService, private userAuthService: UserAuthService, private titleService: TitleService, private pageLoaderService: PageLoaderService, private formBuilder: FormBuilder) {

    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      model: ['Dealer']
    });
  }

  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.titleService.setTitle()
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.pageLoaderService.pageLoader(true);
    this.pageLoaderService.setLoaderText('Checking email existance...');//setting loader text
    this.forgotPasswordSubscription = this.userAuthService.forgotPassword(this.forgotPasswordForm.value)
      .subscribe(
        (response) => {
          this.pageLoaderService.pageLoader(false);
          this.forgotPasswordForm.reset();
          this.alertService.setAlert('success', environment.MESSAGES.MAIL_SENT);
        },
        error => {
          this.pageLoaderService.setLoaderText(environment.MESSAGES.ERROR_TEXT_LOADER);//setting loader text
          this.pageLoaderService.pageLoader(false);
          this.alertService.setAlert('error', error);
        });
  }
  //destroy all subscribers
  ngOnDestroy() {
    // this.forgotPasswordSubscription.unsubscribe();
  }

}
