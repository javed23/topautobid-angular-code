import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
declare  var $:any;
//import core services
import { UserAuthService } from '../../_services/'

import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  subscription: Subscription;
  profileSubscription: Subscription;
  isLoggedin: boolean = false;
  isProfileUpdated: boolean = false;
  loggedinUserType: String = '';
  profileData: any = {};

  constructor(private router: Router, private userAuthService: UserAuthService, private toastr: ToastrManager) {

    this.subscription = this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
      this.isLoggedin = loginStatus.isLoggedIn;
      this.loggedinUserType = loginStatus.userType;
      if (localStorage.getItem('loggedinUser')) {
        this.profileData = JSON.parse(localStorage.getItem('loggedinUser'));
        const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
        this.profileData.profile_pic = (this.profileData.profile_pic) ? this.profileData.profile_pic : defaultPath;
      }
    });

    this.profileSubscription = this.userAuthService.getUpdatedProfileStatus().subscribe((profileStatus) => {
      this.isProfileUpdated = profileStatus.profileUpdatedStatus;
      this.profileData = JSON.parse(localStorage.getItem('loggedinUser'));
      const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
      this.profileData.profile_pic = (this.profileData.profile_pic) ? this.profileData.profile_pic : defaultPath;
    });

  }

  ngOnInit() {  

    if (localStorage.getItem('loggedinUser')) {
      this.isLoggedin = true;
      this.profileData = JSON.parse(localStorage.getItem('loggedinUser'));
      const defaultPath = environment.WEB_ENDPOINT + '/' + environment.DEFAULT_PROFILE
      this.profileData.profile_pic = (this.profileData.profile_pic) ? this.profileData.profile_pic : defaultPath;
    }
    if (JSON.parse(localStorage.getItem("loggedinSellerUser"))) {
      this.loggedinUserType = 'Seller';
    } else if (JSON.parse(localStorage.getItem("loggedinDealerUser"))) {
      this.loggedinUserType = 'Dealer';
    }
  }



  ngAfterViewInit(){
    $(function() {
      $("#filter_toggle_btn").click(function() {
          $(".msg_notification").slideToggle(300);
      });
  });
  }
  logout() {
    this.toastr.successToastr(environment.MESSAGES.LOGOUT_SUCCESS, 'Success!');//showing success toaster
    const redirectUrl = (this.loggedinUserType).toLowerCase() + '/login';
    localStorage.removeItem('loggedinUser');
    localStorage.clear();
    this.userAuthService.isLoggedIn(false, '');
    this.router.navigate(['/' + redirectUrl]);
    return false;
  }

}
