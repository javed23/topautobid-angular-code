import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AlertService } from '../../_services/index';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  
  alertMsgObj:any={};  
  subscription:Subscription;
  constructor(private alertService:AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getAlert().subscribe((alert) => { 
      this.alertMsgObj = alert;
      console.log('alertMsgObj:');
      console.log(this.alertMsgObj);
     });    
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
