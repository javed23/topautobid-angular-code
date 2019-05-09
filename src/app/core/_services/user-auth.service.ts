import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public loggedIn: Subject<any> = new Subject<any>();
  public profileUpdatedStatus: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  isLoggedIn(value: boolean, userType: String) {
    this.loggedIn.next({ isLoggedIn: value, userType: userType });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  isProfileUpdated(value: boolean) {
    this.profileUpdatedStatus.next(value);
  }
  getUpdatedProfileStatus(): Observable<any> {
    return this.profileUpdatedStatus.asObservable();
  }

  /*
    Seller Funtions
  */
  isSellerLoggedin(){
    if (JSON.parse(localStorage.getItem("loggedinSellerUser"))) {
      // logged in so return true
      return true;
    }
    return false
  }
  fetchSellerData(postedData): Observable<any> {

    return this.httpClient
      .post('seller/fetchData', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  sellerLogin(postedData): Observable<any> {

    return this.httpClient
      .post('auth/seller/login', postedData, { observe: 'response' })
      .map((response: any) => {
        return response;
      })

  }
  sellerSignup(postedData): Observable<any> {

    return this.httpClient
      .post('auth/seller/signup', postedData)
      .map((response: Response) => {
        return response;
      })

  }
  verifyDealerEmail(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/verifyEmail', postedData)
      .map((response:any) => {
        return response;
      })

  }

  verifyEmail(postedData): Observable<any> {

    return this.httpClient
      .post('auth/seller/verifyEmail', postedData)
      .map((response:any) => {
        return response;
      })

  }
  setMFA(postedData): Observable<any> {

    return this.httpClient
      .post('auth/seller/setMFA', postedData)
      .map((response:any) => {
        return response;
      })

  }
  setDealerMFA(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/setMFA', postedData)
      .map((response:any) => {
        return response;
      })

  }
  sellerProfile(postedData): Observable<any> {

    return this.httpClient
      .post('seller/profile', postedData)
      .map((response: Response) => {
        return response;
      })

  }
  sellerForgotPassword(postedData): Observable<any> {

    return this.httpClient
      .post('seller/forgotPassword', postedData)
      .map((response: Response) => {
        return response;
      })
  }
  sellerEmailExist(postedData): Observable<any> {

    return this.httpClient
      .post('seller/emailExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }
  sellerPhoneNumberExist(postedData): Observable<any> {

    return this.httpClient
      .post('seller/phoneNumberExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }



  /*
    Dealer Funtions
  */
  
  
  isDealerLoggedin(){
    if (JSON.parse(localStorage.getItem("loggedinDealerUser"))) {
      // logged in so return true
      return true;
    }
    return false
  }
  verifyActivateDealer(postedData){
    return this.httpClient
      .post('dealer/verifyActivateDealer', postedData)
      .map((response: Response) => {
        return response;
      })
  }
  updatePassword(postedData): Observable<any> {
    console.log('postedData',postedData);
    return this.httpClient
      .post('seller/updatePassword', postedData)
      .map((response: Response) => {
        return response;
      })

  }
  
  fetchDealerData(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/fetchData', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  dealerLogin(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/login', postedData, { observe: 'response' })
      .map((response: any) => {
        return response;
      })

  }


  dealerSignup(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/signup', postedData)
      .map((response: Response) => {
        return response;
      })

  }


  dealerProfile(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/profile', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  dealerForgotPassword(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/forgotPassword', postedData)
      .map((response: Response) => {
        return response;
      })
  }
  dealerEmailExist(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/emailExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }


  dealerPhoneNumberExist(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/phoneNumberExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }
  
  
  updateDealerPassword(postedData): Observable<any> {
    //console.log('postedData',postedData);
    return this.httpClient
      .post('dealer/updatePassword', postedData)
      .map((response: Response) => {
        return response;
      })

  }


  //if seller/dealer loggedin then redirect
  checkLoginAndRedirect(){
    console.log('checkLoginAndRedirect');
    //checking and redirecting to seller dashboard page
    if(this.isSellerLoggedin())
      this.router.navigate(['/seller/home']);

    //checking and redirecting to dealer dashboard page
    if(this.isDealerLoggedin())
      this.router.navigate(['/dealer/home']);
  }
}
