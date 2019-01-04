import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) { }

  isLoggedIn(value: boolean) {
      this.loggedIn.next(value);
  }
  checkLoggedinStatus():Observable<any> {
    return this.loggedIn.asObservable();
  }

  checkLogin(postedData): Observable <any> {

    return this.httpClient
        .post('auth/login',postedData)
        .map((response: Response) => {
            return response;
        })
        .catch(this.handleError);
  }

  sellerSignup(postedData): Observable <any> {

    return this.httpClient
        .post('auth/sellerSignup',postedData)
        .map((response: Response) => {
            return response;
        })
        .catch(this.handleError);
  }

  socialLogin(postedData): Observable <any> {
    return this.httpClient
        .post('auth/socialLogin',postedData)
        .map((response: Response) => {
            return response;
        })
        .catch(this.handleError);
  }
  emailExist(postedData): Observable <any> {

    return this.httpClient
        .post('auth/emailExist',postedData)
        .map((response: Response) => {
            return response;
        })
        .catch(this.handleError);
  }


  private handleError(error: Response) {
    return Observable.throw(error);
  }
}
