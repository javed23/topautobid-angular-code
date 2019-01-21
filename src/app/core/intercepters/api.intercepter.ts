import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiIntercepter implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('API_ENDPOINT:' + environment.API_ENDPOINT)
    let apiReq = request.clone({ url: `${request.url}` });
    if (!(request.url).includes('i18n')) {
      apiReq = request.clone({ url: environment.API_ENDPOINT + '/api/' + `${request.url}` });
    }

    return next.handle(apiReq);

  }
}
