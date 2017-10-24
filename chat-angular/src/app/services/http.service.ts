/*
* Real time private chatting app using Angular 2,Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

/* Importing from core library starts*/
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
/* Importing from core library ends*/

/* Importing from rxjs library starts*/
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/* Importing from rxjs library ends*/

/* Importing Models starts */
import { Common } from './../models/common';
import { Auth } from './../models/auth';
import { sessionCheck } from './../models/session-check';
import { Conversation } from './../models/conversation';
import { ChatList } from './../models/chat-list';
/* Importing Models ends */

@Injectable()
export class HttpService {

    /* 
* specifying Base URL.
*/
    private BASE_URL = 'http://localhost:4000/';

    /* 
	* Setting the Request headers.
	*/
    private headerOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
    });

    constructor(private http: Http) { }

    public userNameCheck(params) {
        return this.http.post(`${this.BASE_URL}usernameCheck`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                return new Common(data.error, data.message)
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public login(params) {
        return this.http.post(`${this.BASE_URL}login`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                return new Auth(data.error, data.message, data.userId)
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public registerUser(params) {
        return this.http.post(`${this.BASE_URL}registerUser`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                return new Auth(data.error, data.message, data.userId)
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public userSessionCheck(params) {
        return this.http.post(`${this.BASE_URL}userSessionCheck`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                return new sessionCheck(data.error, data.username, data.message)
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getMessages(params) {
        return this.http.post(`${this.BASE_URL}getMessages`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                let newMessages = data.messages.map(message => {
                    return new Conversation(
                        message.message,
                        message.fromUserId,
                        message.ToUserId,
                        message.timestamp,
                        message.username,
                    );
                });
                data.messages = newMessages;
                return data;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getUsersToChat(params) {
        return this.http.post(`${this.BASE_URL}getUsersToChat`, JSON.stringify(params), this.headerOptions)
            .map((response: Response) => {
                let data = response.json();
                let chatList = data.chatList.map(list => {
                    return new ChatList(
                        list._id,
                        list.online,
                        list.socketId,
                        list.timestamp,
                        list.username
                    )
                });
                data.chatList = chatList;
                return data;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}