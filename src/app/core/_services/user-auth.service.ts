import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public loggedIn: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) { }

  isLoggedIn(value: boolean, userType: String) {
    this.loggedIn.next({ isLoggedIn: value, userType: userType });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }
  fetchDealerData(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/fetchData', postedData)
      .map((response: Response) => {
        return response;
      })

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
  dealerLogin(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/login', postedData, { observe: 'response' })
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
  dealerSignup(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealer/signup', postedData)
      .map((response: Response) => {
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

  dealerProfile(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/profile', postedData)
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
  dealerForgotPassword(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/forgotPassword', postedData)
      .map((response: Response) => {
        return response;
      })
  }

  socialLogin(postedData): Observable<any> {
    return this.httpClient
      .post('auth/socialLogin', postedData)
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
  dealerEmailExist(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/emailExist', postedData)
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
  dealerPhoneNumberExist(postedData): Observable<any> {

    return this.httpClient
      .post('dealer/phoneNumberExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }
}
