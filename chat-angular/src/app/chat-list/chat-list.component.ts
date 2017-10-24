/* Importing from core library starts*/
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/* Importing from core library ends*/

/* Importing ToastsManager library starts*/
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* Importing ToastsManager library ends*/

/* Importing Application services starts*/
import { AppService } from './../services/app.service';
import { HttpService } from './../services/http.service';
import { SocketService } from './../services/socket.service';
import { EmitterService } from './../services/emitter.service';
/* Importing Application services ends*/
import { ChatList } from './../models/chat-list';

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

	/*
	* Variables to host data for this component starts
	*/
	private userId: string = null;
	private selectedUserId: string = null;
	private selectedUserName: string = null;
	private chatListUsers: ChatList[] = [];
	/*
	* Variables to host data for this component ends
	*/

	/*
	* Incoming data from other component starts
	*/
	@Input() conversation: any;
	@Input() selectedUserInfo: any;
	/*
	* Incoming data from other component ends
	*/

	constructor(
		private toastr: ToastsManager,
		private _vcr: ViewContainerRef,
		private route: ActivatedRoute,
		private router: Router,
		private appService: AppService,
		private socketService: SocketService
	) {
		this.toastr.setRootViewContainerRef(_vcr);
	}

    /*
    * Getting the userID from URL starts
    */
	ngOnInit() {
		this.userId = this.route.snapshot.params['userid'];
	}

	getChatList(): void {

		this.chatListUsers = [];

		if (this.userId === '' || typeof this.userId === 'undefined') {
			this.toastr.error("Can't get the chat list,try after some time.", 'This is rear.');
		} else {
			/*
		* calling method of service to get the chat list.
		*/
			this.socketService.getChatList(this.userId).subscribe(response => {
				if (!response.error) {

					if (response.singleUser) {

						/* 
						* Removing duplicate user from chat list array.
						*/
						if (this.chatListUsers !== null && this.chatListUsers.length > 0) {
							this.chatListUsers = this.chatListUsers.filter((obj) => {
								return obj._id !== response.chatList[0]._id;
							});
						}

						/* 
						* Adding new online user into chat list array
						*/
						if (this.chatListUsers === null) {
							this.chatListUsers = response.chatList;
						} else {
							if (response.chatList.length > 0) {
								this.chatListUsers.push(response.chatList[0]);
							}
						}
						/* 
						* Showing Notification when a new user comes online.
						*/
						this.toastr.success(response.chatList[0].username + ' appeared online.');

					} else if (response.userDisconnected) {
						/* 
						* Showing Notification when a user goes offline  starts.
						*/
						if (this.chatListUsers !== null) {
							let offlineUser = null;
							this.chatListUsers = this.chatListUsers.filter((obj) => {
								if (obj.socketId === response.socketId) {
									offlineUser = obj;
									obj.online = 'N';
								}
								return true;
							});
							if (offlineUser !== null) {
								this.toastr.info(offlineUser.username + ' Went offline.');
							}
						}
						/* 
						* Showing Notification when a user goes offline ends.
						*/
					} else {
						/* 
						* Updating entire chatlist if user logs in.
						*/
						this.chatListUsers = response.chatList;
					}
				} else {
					this.toastr.error("Can't get the chat list,try after some time.", 'This is rear.');
				}
			});
		}
	}

	/* 
	* Method to select the user from the Chat list starts
	*/
	private selectedUser(user): void {
		this.selectedUserId = user._id;
		this.selectedUserName = user.username;

		/*
		* Sending selected users information to other component starts.
		*/
		EmitterService.get(this.selectedUserInfo).emit(user);
		/* 
		* calling method to get the messages
		*/
		this.appService.getMessages({ userId: this.userId, toUserId: user._id }, (error, response) => {
			console.log(response);

			/*
			* Sending conversation between two users to other component starts.
			*/
			EmitterService.get(this.conversation).emit(response);
		});
	}

	/*
	* Method required for UI to indicate the selected user starts.
	*/
	private isUserSelected(userId: string): boolean {
		if (!this.selectedUserId) {
			return false;
		}
		return this.selectedUserId === userId ? true : false;
	}
}