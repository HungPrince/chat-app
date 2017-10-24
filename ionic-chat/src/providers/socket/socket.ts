import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

import { API_URL } from '../../constants/constant';

import { Observable } from 'rxjs/Observable';
/*
  Generated class for the SocketProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocketProvider {

  public socket;

  constructor(public http: Http) {
    console.log('Hello SocketProvider Provider');
  }

  connectSocket(userId: string) {
    this.socket = io(API_URL, { query: `{userId:= ${userId}}` });
  }

  sendMessage(message: any): void {
    this.socket.emit('add-message', message);
  }

  logout(userId: any): any {
    this.socket.emit('logout', userId);
    let observable = new Observable(observer => {
      this.socket.on('logout-response', (data) => {
        observer.next(data);
        console.log(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  }

  recevieMessage(): any {
    let observable = new Observable(observer => {
      this.socket.on('add-message-response', (data) => {
        observer.next({
          'message': data.message,
          'fromUserId': data.fromUserId,
          'toUserId': data.toUserId,
          'timestamp': data.timestamp,
          'username': data.username
        });
        return () => {
          this.socket.disconnect();
        }
      });
      return observable;
    });
  }

}
