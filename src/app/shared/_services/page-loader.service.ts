import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  public pageLoaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public pageLoaderText: Subject<any> = new Subject<any>();

  constructor() { }

  pageLoader(value: boolean) {
    console.log('value:' + value);
    this.pageLoaderStatus.next(value)
  }

  setLoaderText(text?: String) {
    this.pageLoaderText.next(text);
  }
  getLoaderText(): Observable<any> {
    return this.pageLoaderText.asObservable();
  }
}
