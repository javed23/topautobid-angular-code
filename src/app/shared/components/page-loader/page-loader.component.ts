import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageLoaderService } from '../../_services'
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  showLoader: boolean;
  constructor(private ref:ChangeDetectorRef, private PageLoaderService:PageLoaderService) { }

  ngOnInit() {
    this.PageLoaderService.pageLoaderStatus.subscribe((val: boolean) => {
      console.log('val:'+val);
      this.showLoader = val;
      console.log('loader:'+this.showLoader);
      this.ref.detectChanges();
  })
  }

}
