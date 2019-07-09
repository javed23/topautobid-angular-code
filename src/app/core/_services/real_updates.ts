import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/of';
import { PagedData,SellerRatingReview, Page } from "../../core/_models";
import { retry } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment'
/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class RealUpdateService {
    private url = environment.API_ENDPOINT;
  
    private socket;
    constructor(private httpClient: HttpClient) { 

        this.socket = socketIo(this.url);
        console.log('the socket connectiuon is ->>>>>>>',this.socket)
        

    }


    public updateRealTimeData() {
        this.socket.emit('placebid');
    }
  
    public updateRealTimeOnAcceptBid() {
      this.socket.emit('acceptbid');
  }



    public updateLsiting(){
      let observable = new Observable(observer => {
       
        this.socket.on('broadcast', (data) => {
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });
    return observable
    }
    
    public updateLsitingOnBidAcception(){
      let observable = new Observable(observer => {
       
        this.socket.on('bidaccepted', (data) => {
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });
    return observable
    }
  
    

}
