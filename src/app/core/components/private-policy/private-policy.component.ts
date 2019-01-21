import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//modules core services
import { TitleService } from '../../_services/index'
@Component({
  selector: 'app-private-policy',
  templateUrl: './private-policy.component.html'
})
export class PrivatePolicyComponent implements OnInit {
  @ViewChild("contentSection") contentSection: ElementRef;

  title: string = 'Privacy Policy';
  breadcrumbs: any = [{ page: 'Home', link: '' }, { page: 'Login', link: '/seller/login' }, { page: 'Privacy Policy', link: '' }]

  constructor(private titleService: TitleService) { }

  ngOnInit() {
    this.contentSection.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.titleService.setTitle();
  }

}
