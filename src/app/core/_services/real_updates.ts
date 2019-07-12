import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { PagedData, SellerRatingReview, Page } from "../../core/_models";
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


  }


  public saveUserOnSocketIo() {
    console.log('the socket connectiuon is ->>>>>>>', this.socket);
    let user = JSON.parse(localStorage.getItem('loggedinUser'));
    let isDealer = JSON.parse(localStorage.getItem('loggedinDealerUser'));

    this.socket.emit('saveuser', { username: user.username, isSeller: isDealer ? false : true });

  }


  public updateRealTimeData() {
    this.socket.emit('placebid');
  }

  public sendMessage(message){
    let user = JSON.parse(localStorage.getItem('loggedinUser'));
    message['from'] = {username:user.username,socketId:this.socket.id}
  this.socket.emit('newMessage',message)
  }

  public updateRealTimeOnAcceptBid() {
    this.socket.emit('acceptbid');
  }



  public updateLsiting() {
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

  public updateLsitingOnBidAcception() {
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

  public updateUsers() {

    let observable = new Observable(observer => {

      this.socket.on('usernames', (data) => {
        console.log('the data is ',data)
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });
    return observable
  }



  public haveNewMessage() {

    let observable = new Observable(observer => {

      this.socket.on('haveNewMessage', (data) => {
        console.log('the data is ',data)
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });
    return observable
  }
}
