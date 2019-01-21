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
  fetchUserData(postedData): Observable<any> {

    return this.httpClient
      .post('auth/fetchUserData', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  checkLogin(postedData): Observable<any> {

    return this.httpClient
      .post('auth/login', postedData, { observe: 'response' })
      .map((response: any) => {
        return response;
      })

  }

  sellerSignup(postedData): Observable<any> {

    return this.httpClient
      .post('auth/sellerSignup', postedData)
      .map((response: Response) => {
        return response;
      })

  }
  dealerSignup(postedData): Observable<any> {

    return this.httpClient
      .post('auth/dealerSignup', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  profile(postedData): Observable<any> {

    return this.httpClient
      .post('auth/profile', postedData)
      .map((response: Response) => {
        return response;
      })

  }

  forgotPassword(postedData): Observable<any> {

    return this.httpClient
      .post('auth/forgotPassword', postedData)
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

  emailExist(postedData): Observable<any> {

    return this.httpClient
      .post('auth/emailExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }

  phoneNumberExist(postedData): Observable<any> {

    return this.httpClient
      .post('auth/phoneNumberExist', postedData)
      .map((response: Response) => {
        return response;
      })
  }
}
