import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router){}
  
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      if (localStorage.getItem('loggedin')) {
          // logged in so return true
          return true;
      }
  
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/dealer'], { queryParams: { returnUrl: state.url }});
      return false;
    }
}
