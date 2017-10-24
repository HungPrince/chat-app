/*
* Real time private chatting app using Angular 2,Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/


import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/*
* npm install @types/socket.io-client --save
*/
import * as io from 'socket.io-client';

/* Importing Models starts */
import { ChatList } from './../models/chat-list';
import { Conversation } from './../models/conversation';
/* Importing Models ends */

@Injectable()
export class SocketService {

	/* 
	* specifying Base URL.
	*/
	private BASE_URL = 'http://localhost:4000';  
  	public socket;

  	constructor() {}

  	/* 
	* Method to connect the users to socket
	*/
  	connectSocket(userId:string){
  		this.socket = io(this.BASE_URL,{ query: `userId=${userId}`});
  	}
 
 	/* 
	* Method to emit the add-messages event.
	*/
	sendMessage(message:any):void{
		this.socket.emit('add-message', message);
	}

	/* 
	* Method to emit the logout event.
	*/
	logout(userId):any{

		this.socket.emit('logout', userId);

		let observable = new Observable(observer => {
			this.socket.on('logout-response', (data) => {
				console.log(data);
				observer.next(data);    
			});

			return () => {
				
				this.socket.disconnect();
			};  
		})     
		return observable;
	}

	/* 
	* Method to receive add-message-response event.
	*/
	receiveMessages():any{ 
		let observable = new Observable(observer => {
			this.socket.on('add-message-response', (data) => {
				observer.next(
					new Conversation(
						data.message,
						data.fromUserId,
						data.toUserId,
						data.timestamp,
						data.username
					)
				);    
			});

			return () => {
				this.socket.disconnect();
			};  
		});     
		return observable;
	}

	/* 
	* Method to receive chat-list-response event.
	*/
	getChatList(userId:string):any {

		this.socket.emit('chat-list' , { userId : userId });

		let observable = new Observable(observer => {
			this.socket.on('chat-list-response', (data) => {
				if(data.chatList !== null && data.chatList !== undefined) {
					let userChatList = data.chatList;
					let modelChatList = [];
					if(userChatList !== null) {
						for (var i = 0; i < userChatList.length; i++) {
							modelChatList.push(
								new ChatList(
									userChatList[i]._id,
									userChatList[i].online,
									userChatList[i].socketId,
									userChatList[i].timestamp,
									userChatList[i].username
								)
							);
						}
						delete data.chatList; 
						data.chatList = modelChatList;
					}
				}
				observer.next(data);    
			});

			return () => {
				this.socket.disconnect();
			};  
		})
		return observable;
	}
}