/* Importing from core library starts*/
import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/* Importing from core library ends*/

/* Importing ToastsManager library starts*/
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* Importing ToastsManager library ends*/


/* Importing Application service(i.e. AppService) and http service starts*/
import { AppService } from './../services/app.service';
import { HttpService } from './../services/http.service';
import { SocketService } from './../services/socket.service';
/* Importing Application service(i.e. AppService) and http service ends*/


@Component({
	selector: 'app-new-chat',
	templateUrl: './new-chat.component.html',
	styleUrls: ['./new-chat.component.css'],
})
export class NewChatComponent {

	private userId = null;
	private selectedUserId = null;
	private selectedSocketId = null;
	private message = null;
	private usersToChat = [];

	@Output('closeModel') closeModel = new EventEmitter<boolean>();


	constructor(
		private httpService: HttpService,
		private appService: AppService,
		private socketService: SocketService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastsManager,
		private _vcr: ViewContainerRef
	) { }

	public getUsersToChat() {
		this.userId = this.route.snapshot.params['userid'];
		if (this.userId === '' || typeof this.userId == 'undefined') {
			this.router.navigate(['/']);
		} else {
			this.appService.getUsersToChat({
				userId: this.userId
			}, (error, response) => {
				if (error) {
					this.toastr.info('No one to chat, try after some time.');
				} else {
					this.usersToChat = response.chatList;
				}
			});
		}
	}

	private selectToChat(user): void {
		this.selectedUserId = user._id;
		this.selectedSocketId = user.socketId;
	}
	/*
	* Method required for UI to indicate the selected user starts.
	*/
	private selectedUserToChat(userId: string): boolean {
		if (!this.selectedUserId) {
			return false;
		}
		return this.selectedUserId === userId ? true : false;
	}

	private sendNewMessage() {
		if (this.message === '' || this.message === null) {
			this.toastr.error('Message cant be empty.');
		} else {

			if (this.message === '') {
				this.toastr.error('Message cant be empty.');
			} else if (this.userId === '') {
				this.router.navigate(['/']);
			} else if (this.selectedUserId === null) {
				this.toastr.error('Select a user to chat.');
			} else {

				const data = {
					fromUserId: this.userId,
					message: (this.message).trim(),
					toUserId: this.selectedUserId,
					toSocketId: this.selectedSocketId,
					startNewChat: true
				}

				/* 
				* calling method to send the messages
				*/
				this.message = null;
				this.socketService.sendMessage(data);
				this.closeModel.emit(true);
			}
		}
	}
}
