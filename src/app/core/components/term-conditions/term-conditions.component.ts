import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//modules core services
import { TitleService } from '../../_services/index'

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html'
})
export class TermConditionsComponent implements OnInit {

  @ViewChild("contentSection") contentSection: ElementRef;

  title: string = 'User Agreement';
  breadcrumbs: any = [{ page: 'Home', link: '' }, { page: 'Login', link: '/seller/login' }, { page: 'User Agreement', link: '' }]


  constructor(private titleService: TitleService) { }

  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.titleService.setTitle();
  }

}
