/* Importing from core library starts*/
import { Component, OnInit, Input, OnChanges,ViewContainerRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
/* Importing from core library ends*/

/* Importing ToastsManager library starts*/
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* Importing ToastsManager library ends*/

/* Importing Application services starts*/
import { EmitterService } from './../services/emitter.service';
import { SocketService } from './../services/socket.service';
/* Importing Application services ends*/

@Component({
	selector: 'app-conversation',
  	templateUrl: './conversation.component.html',
  	styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit {

	/*
	* Variables to host data for this component starts
	*/
	private userId = null;
	private message = null;
	private selectedUser = null;
	private messages = null;
	/*
	* Variables to host data for this component ends
	*/
	
	/*
	* Incoming data from other component starts
	*/
	@Input() conversation: any;
	@Input() selectedUserInfo:any;
	/*
	* Incoming data from other component ends
	*/
	
	constructor(
		private toastr: ToastsManager, 
		private _vcr: ViewContainerRef,
		private route :ActivatedRoute,
		private router :Router,
		private socketService :SocketService
	) { }
	
	ngOnInit() {
		this.userId = this.route.snapshot.params['userid'];
	}

	listenForMessages(){
		/* 
		* subscribing for messages starts
		*/
    	this.socketService.receiveMessages().subscribe(response => {
			this.toastr.success(response.message, response.username + ' sent you message');
			if(this.selectedUser !== null) {
				if(this.selectedUser._id && this.selectedUser._id == response.fromUserId) {
	    			this.messages.push(response);
	    			setTimeout( () =>{
	    				document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			},100);
	    		}
			}    		
    	});
    	/* 
		* subscribing for messages ends
		*/
	}

	private alignMessage(userId){
		return this.userId ===  userId ? false : true;
	}

	private sendMessage(event){
		if(event.keyCode === 13) {
			if(this.message === '' || this.message === null) {
				alert(`Message can't be empty.`);
			}else{

				if (this.message === '') {
					this.toastr.error(`Message can't be empty.`);
				}else if(this.userId === ''){
					this.router.navigate(['/']);					
				}else if(this.selectedUser === null){
					this.toastr.error(`Select a user to chat.`);
				}else{

					const data = {
						fromUserId : this.userId,
						message : (this.message).trim(),
						toUserId : this.selectedUser._id,
						toSocketId : this.selectedUser.socketId
					}
					this.messages.push(data);
					setTimeout( () =>{
	    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			},100);
					
					/* 
					* calling method to send the messages
					*/
					this.message = null;
					this.socketService.sendMessage(data);
				}
			}
		}
	}

	ngOnChanges(changes:any) {
		
		EmitterService.get(this.selectedUserInfo).subscribe( (selectedUser) => {
			 this.selectedUser = selectedUser;
		});

		EmitterService.get(this.conversation).subscribe( (data) => {
			this.messages = data.messages;
		});
	}
}