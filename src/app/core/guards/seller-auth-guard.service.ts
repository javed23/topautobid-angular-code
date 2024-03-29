import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerAuthGuardService implements CanActivate {

    constructor(private router: Router){}
  
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      console.log('loggedin');
      console.log(localStorage.getItem('loggedinUser'))
      if (localStorage.getItem('loggedinUser')) {
          // logged in so return true
          return true;
      }
  
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/seller/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
}
