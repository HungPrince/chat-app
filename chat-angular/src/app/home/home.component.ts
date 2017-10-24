/* Importing from core library starts*/
import { Component, OnInit, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
/* Importing from core library ends*/

import { ChatListComponent } from '../chat-list/chat-list.component';
import { ConversationComponent } from '../conversation/conversation.component';
import { NewChatComponent } from '../new-chat/new-chat.component';

/* Importing ToastsManager library starts*/
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ModalDirective } from 'ng2-bootstrap';
/* Importing ToastsManager library ends*/

/* Importing Application service(i.e. AppService) and http service starts*/
import { AppService } from './../services/app.service';
import { HttpService } from './../services/http.service';
import { SocketService } from './../services/socket.service';
import { EmitterService } from './../services/emitter.service';
/* Importing Application service(i.e. AppService) and http service ends*/

@Component({
  	selector: 'app-home',
  	templateUrl: './home.component.html',
  	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

	/*
	* Chat and message related variables starts
	*/
	private userId = null;
	private username = null;
	private userSocketId =null;
	/*
	* Chat and message related variables ends
	*/

	@ViewChild(ChatListComponent) chatListComponent: ChatListComponent
	@ViewChild(ConversationComponent) conversationComponent: ConversationComponent
	@ViewChild(NewChatComponent) NewChatComponent: NewChatComponent
  	@ViewChild('lgModal') public lgModal: ModalDirective;

	private conversation = 'CONVERSATION';

	constructor( 
    	private socketService : SocketService,
    	private httpService : HttpService,
		private appService : AppService,
		private route :ActivatedRoute,
		private router :Router,
		private _emitterService: EmitterService
	) { }

	ngOnInit() {
		/*
		* getting userID from URL using 'route.snapshot'
		*/		
		this.userId = this.route.snapshot.params['userid'];
		if(this.userId === '' || typeof this.userId == 'undefined') {
			this.router.navigate(['/']);
		}else{
			/*
			* Checking if user is logged in or not, starts
			*/	
			this.appService.userSessionCheck(this.userId,( response )=>{
				this.username = response.username;
				/*
				* making socket connection by passing UserId.
				*/	
				this.socketService.connectSocket(this.userId);

				this.chatListComponent.getChatList();

				this.conversationComponent.listenForMessages();
	    	});
	    	/*
			* Checking if user is logged in or not, starts
			*/
		}
	}

	private getUsersToChat(){
		this.NewChatComponent.getUsersToChat();;
	    this.lgModal.show();
	}

	private closeModel(event){
		this.lgModal.hide();
		this.chatListComponent.getChatList();
	}
	
	private logout(){
		this.socketService.logout({userId : this.userId}).subscribe(response => {
			this.router.navigate(['/']); /* Home page redirection */
		});
	}
}