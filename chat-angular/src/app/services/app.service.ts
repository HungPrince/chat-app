import { Injectable } from '@angular/core';

/* Importing http service starts*/
import { HttpService } from './http.service';
/* Importing http service ends*/

/* Importing Models starts */
import { Common } from './../models/common';
import { Auth } from './../models/auth';
import { sessionCheck } from './../models/session-check';
import { Conversation } from './../models/conversation';
/* Importing Models ends */

@Injectable()
export class AppService {

	constructor(public httpService : HttpService) {

	}

	/* 
	* check if username already exists.
	*/
	public userNameCheck(params,callback){
		this.httpService.userNameCheck(params).subscribe(
  				response => {
                  callback(response);
  				},
  				error => {
  					callback(new Common( true,'Error occured,Please try after some time.'));
  				}
  			);
	}

	/* 
	* Login the user
	*/
	public login(params ,callback):any{
		this.httpService.login(params).subscribe(
				response => {
					callback(response);
				},
				error => {
					callback(new Auth(true,'Error occured,Please try after some time.',null));
				}
			);
	}

  /* 
	* method to add new users
	*/
	public registerUser(params,callback):any{
		this.httpService.registerUser(params).subscribe(
				response => {
                    callback(response);
				},
				error => {
					callback(new Auth(true,'Error occured,Please try after some time.',null));
				}
			);
	}

  /* 
	* Method to check the session of user.
	*/
  public userSessionCheck(userId , callback):any{
  	this.httpService.userSessionCheck({userId : userId}).subscribe(
              response => {
                  console.log(response);
                  callback(response);
              },
              error => {
                  callback(new sessionCheck(true,null,'You not loogged in.'));
              }
          );
  }

  /* 
	* method to get the messages between two users
	*/
  public getMessages(params ,callback):any{
      this.httpService.getMessages(params).subscribe(
              response => {
                  callback(false,response);
              },
              error => {
                  callback(true,'HTTP fail.');
              }
          );
  }

  /* 
  * method to get the users to chat (start a new chat)
  */
  public getUsersToChat( params,callback):any{
      this.httpService.getUsersToChat(params).subscribe(
              response => {
                  callback(false,response);
              },
              error => {
                  callback(true,'HTTP fail.');
              }
          );
  }

}