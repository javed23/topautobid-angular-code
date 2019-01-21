import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { LocationStrategy } from '@angular/common';

//import core services
import { UserAuthService } from '../../_services/'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  subscription: Subscription;
  isLoggedin: boolean = false;
  loggedinUserType: String = '';
  loadDealerModule: boolean = false;
  loadSellerModule: boolean = true;

  constructor(private locationStrategy: LocationStrategy, private router: Router, private userAuthService: UserAuthService) {
    this.subscription = this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => {
      this.isLoggedin = loginStatus.isLoggedIn;
      this.loggedinUserType = loginStatus.userType;
    });

  }

  ngOnInit() {
    const currentLocation = this.locationStrategy.path()
    this.loadDealerModule = (currentLocation.includes('dealer') || currentLocation.includes('/dealer')) ? true : false;
    this.loadSellerModule = (this.loadDealerModule) ? false : true;

    if (localStorage.getItem('loggedinUser')) {
      this.isLoggedin = true;
    }
    if (JSON.parse(localStorage.getItem("loggedinSellerUser"))) {
      this.loggedinUserType = 'Seller';
    } else if (JSON.parse(localStorage.getItem("loggedinDealerUser"))) {
      this.loggedinUserType = 'Dealer';
    }
  }

  logout() {
    const redirectUrl = (this.loggedinUserType).toLowerCase() + '/login';
    localStorage.removeItem('loggedinUser');
    localStorage.clear();
    this.userAuthService.isLoggedIn(false, '');
    this.router.navigate(['/' + redirectUrl]);
    return false;
  }

}
