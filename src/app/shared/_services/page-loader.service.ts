import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  public pageLoaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() { }

  pageLoader(value: boolean){
    console.log('value:'+value);
    this.pageLoaderStatus.next(value)
  }
}
