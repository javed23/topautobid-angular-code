import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import { Subscription } from 'rxjs/Subscription';


//import core services
import { UserAuthService } from '../_services/'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  subscription:Subscription;
  isLoggedin:boolean = false;
  isLoggedinManual:any = false;

  constructor(private router: Router, private userAuthService:UserAuthService) { 
    this.subscription = this.userAuthService.checkLoggedinStatus().subscribe((loginStatus) => { 
      this.isLoggedin = loginStatus;     
     }); 
  }

  ngOnInit() {
    console.log('loggedinUser:');
    console.log(localStorage.getItem('loggedinUser'))
    if (localStorage.getItem('loggedinUser')) {
      this.isLoggedin = true;
    }    
  }

  logout(){
    localStorage.removeItem('loggedinUser');
    localStorage.clear();
    this.userAuthService.isLoggedIn(false);
    this.router.navigate(['/web']);
    return false;
  }

}
