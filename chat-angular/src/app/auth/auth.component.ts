/* Importing from core library starts*/
import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
/* Importing from core library ends*/

/* Importing ToastsManager library starts*/
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
/* Importing ToastsManager library ends*/

/* Importing Application services starts*/
import { AppService } from './../services/app.service';
import { HttpService } from './../services/http.service';
/* Importing Application services ends*/

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css'],
})

export class AuthComponent {

	/*
	* Variables to host data for this component starts
	*/

	/* Variables to hold users data (ng-model) for this component starts*/
	private username = null;
	private email = null;
	private password = null;

	/* Will be used to hide and show the errors for username availability check*/
	private isuserNameAvailable = false;

	/* Used for username availability check funcnality*/
	private userTypingTimeout = 500;
	private typingTimer = null;
	/*
	* Variables to host data for this component ends
	*/

	constructor(
		private toastr: ToastsManager,
		private _vcr: ViewContainerRef,
		private chatService: AppService,
		private router: Router
	) {
		this.toastr.setRootViewContainerRef(_vcr);
	}


	/*
	* Method to check the availability of the username starts
	*/
	public onkeyup(event) {

		clearTimeout(this.typingTimer);

		this.typingTimer = setTimeout(() => {

			this.chatService.userNameCheck({
				'username': this.username
			}, (response) => {
				console.log(response);
				if (response.error) {
					this.isuserNameAvailable = true;
				} else {
					this.isuserNameAvailable = false;
				}
			});

		}, this.userTypingTimeout);
	}

	public onkeydown(event) {
		clearTimeout(this.typingTimer);
	}
	/*
	* Method to check the availability of the username ends
	*/

	/*
	* Method to Login the new user starts
	*/
	public login(): void {
		if (this.username === '' || this.username === null) {
			this.toastr.error("Username can't be empty.", 'Fill the form');
		} else if (this.password === '' || this.password === null) {
			this.toastr.error("Password can't be empty.", 'Fill the form');
		} else {
			this.chatService.login({
				'username': this.username,
				'password': this.password,
			}, (response) => {
				if (!response.error) {
					this.router.navigate(['/home/' + response.userId]);
				} else {
					this.toastr.error(response.message, 'No trespassing.');
				}
			});
		}
	}
	/*
	* Method to Login the new user starts
	*/



	/*
	* Method to register the new user starts
	*/
	public registerUser(): void {

		if (this.username === '') {
			this.toastr.error("Username can't be empty.", 'Fill the form');
		} else if (this.email === '') {
			this.toastr.error("Email can't be empty.", 'Fill the form');
		} else if (this.password === '') {
			this.toastr.error("Password can't be empty.", 'Fill the form');
		} else {
			this.chatService.registerUser({
				username: this.username,
				email: this.email,
				password: this.password
			}, (response) => {
				if (!response.error) {
					this.router.navigate(['/home/' + response.userId]);
				} else {
					this.toastr.error(response.message, 'This very Rear.');
				}
			});
		}
	}
    /*
  	* Method to register the new user ends
  	*/
}
