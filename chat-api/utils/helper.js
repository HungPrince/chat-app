/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

'use strict';

const async = require('async');

class Helper {

	constructor() {
		this.Mongodb = require("./db");
	}

	/*
	* Name of the Method : userNameCheck
	* Description : To check if the username is available or not.
	* Parameter : 
	*		1) data query object for MongDB
	*		2) callback function
	* Return : callback 
	*/
	getListUser(callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').find().toArray((error, result) => {
				db.close();
				callback(result);
			});
		})
	}

	userNameCheck(data, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').find(data).count((err, result) => {
				db.close();
				callback(result);
			});
		});
	}

	/*
	* Name of the Method : login
	* Description : login the user.
	* Parameter : 
	*		1) data query object for MongDB
	*		2) callback function
	* Return : callback 
	*/
	login(data, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			console.log(data);
			db.collection('users').findAndModify(data, [], { $set: { 'online': 'Y' } }, {}, (err, result) => {
				db.close();
				callback(err, result.value);
			});
		});
	}

	/*
	* Name of the Method : registerUser
	* Description : register the User
	* Parameter : 
	*		1) data query object for MongDB
	*		2) callback function
	* Return : callback 
	*/
	registerUser(data, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').insertOne(data, (err, result) => {
				db.close();
				callback(err, result);
			});
		});
	}

	/*
	* Name of the Method : userSessionCheck
	* Description : to check if user is online or not.
	* Parameter : 
	*		1) data query object for MongDB
	*		2) callback function
	* Return : callback 
	*/
	userSessionCheck(data, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').findOne({ _id: ObjectID(data.userId), online: 'Y' }, (err, result) => {
				db.close();
				callback(err, result);
			});
		});
	}


	/*
	* Name of the Method : getUserInfo
	* Description : to get information of single user.
	* Parameter : 
	*		1) userId of the user
	*		2) callback function
	* Return : callback 
	*/
	getUserInfo(userId, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').findOne({ _id: ObjectID(userId) }, (err, result) => {
				db.close();
				callback(err, result);
			});
		});
	}

	/*
	* Name of the Method : addSocketId
	* Description : Updates the socket id of single user.
	* Parameter : 
	*		1) userId of the user
	*		2) callback function
	* Return : callback 
	*/
	addSocketId(data, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').update({ _id: ObjectID(data.id) }, data.value, (err, result) => {
				db.close();
				callback(err, result.result);
			});
		});
	}

	/*
	* Name of the Method : getUsersToChat
	* Description : To get the list of users to start a new chat.
	* Parameter : 
	*		1) userId (socket id) of the user
	*		2) callback function
	* Return : callback 
	*/
	getUsersToChat(userId, callback) {

		const Mongodb = this.Mongodb;

		async.waterfall([
			(callback) => {

				Mongodb.onConnect((db, ObjectID) => {
					/*
					* Finding the list of userid from chatlist collection starts.
					*/
					db.collection('chatlist').findOne({ 'userId': userId }, (err, queryResponse) => {
						db.close();
						/*
						* if loop starts
						*/
						if (queryResponse === null) {
							callback(true, {
								getAllUsers: true
							});
						} else {
							callback(null, queryResponse);
						}
					});
					/*
					* Finding the list of userid from chatlist collection ends.
					*/
				});
			},
			(params, callback) => {

				let chatListIds = params.chatlist;

				if (chatListIds.length === 0 || chatListIds.length < 1) {
					callback(true, {
						getAllUsers: true
					});
				} else {

					Mongodb.onConnect((db, ObjectID) => {
						let mongoIds = [];
						chatListIds.forEach((ids) => {
							mongoIds.push(ObjectID(ids));
						});
						mongoIds.push(ObjectID(userId));

						/*
						* fetching the user's information from the users table.
						* here, `mongoIds` is list of user ids which we fetched from chatlist ocllection.
						*/
						db.collection('users').find({ _id: { $nin: mongoIds } }).toArray((err, queryResult) => {
							db.close();

							if (err) {
								callback(true, {
									getAllUsers: true
								});
							} else {
								/*
								* Removing the password and email from the Query result.
								*/
								queryResult.forEach((users) => {
									delete users.password;
									delete users.email;
								});

								callback(true, {
									getAllUsers: false,
									chatlist: queryResult
								});
							}
						});
					});
				}
			},
		], (err, result) => {
			if (result.getAllUsers) {
				Mongodb.onConnect((db, ObjectID) => {
					db.collection('users').find({ _id: { $ne: ObjectID(userId) } }).toArray((err, result) => {
						db.close();
						if (err) {
							callback(true, null);
						} else {
							callback(false, result);
						}
					});
				});
			} else {
				callback(false, result.chatlist);
			}
		});
	}

	/*
	* Name of the Method : getChatList
	* Description : To get the list of online user.
	* Parameter : 
	*		1) userId (socket id) of the user
	*		2) callback function
	* Return : callback 
	*/
	getChatList(userId, userSocketId, callback) {

		const Mongodb = this.Mongodb;

		async.waterfall([
			(callback) => {

				Mongodb.onConnect((db, ObjectID) => {
					/*
					* Finding the list of userid from chatlist collection starts.
					*/
					db.collection('chatlist').findOne({ 'userId': userId }, (err, queryResponse) => {
						db.close();
						/*
						* if loop starts
						*/
						if (queryResponse === null) {
							callback(true, {
								isNull: true
							});
						} else {
							callback(null, queryResponse);
						}
					});
					/*
					* Finding the list of userid from chatlist collection ends.
					*/
				});
			},
			(params, callback) => {

				let chatListIds = params.chatlist;

				if (chatListIds.length === 0 || chatListIds.length < 1) {
					callback(true, {
						isNull: true
					});
				} else {

					Mongodb.onConnect((db, ObjectID) => {
						let mongoIds = [];
						chatListIds.forEach((ids) => {
							mongoIds.push(ObjectID(ids));
						});

						/*
						* fetching the user's information from the users table.
						* here, `mongoIds` is list of user ids which we fetched from chatlist ocllection.
						*/
						db.collection('users').find({ _id: { $in: mongoIds } }).toArray((err, queryResult) => {
							db.close();

							if (err) {
								callback(true, {
									isNull: true
								});
							} else {
								/*
								* Removing the password and email from the Query result.
								*/
								let socketIds = [];
								queryResult.forEach((users) => {
									delete users.password;
									delete users.email;
									socketIds.push(users.socketId);
								});

								callback(true, {
									isNull: false,
									chatList: queryResult,
									chatListIds: socketIds
								});
							}
						});
					});
				}
			},
		], (err, result) => {
			if (result.isNull) {
				callback(true, null);
			} else {
				callback(false, result);
			}
		});
	}

	/*
	* Name of the Method : insertMessages
	* Description : To insert a new message into DB.
	* Parameter : 
	*		1) data comprises of message,fromId,toId
	*		2) callback function
	* Return : callback 
	*/
	insertMessages(data, callback) {
		const Mongodb = this.Mongodb;
		const userId = data.fromUserId;
		const toUserId = data.toUserId;

		this.insertChatListForFriend(data);

		async.waterfall([
			(callback) => {
				/*
				* Finding the userid from chatlist collection starts.
				*/
				Mongodb.onConnect((db, ObjectID) => {
					db.collection('chatlist').findOne({ 'userId': userId }, (err, queryResponse) => {
						db.close();
						if (queryResponse === null) {
							/* Passing callback to next function */
							callback(null, null);
						} else {
							/* Passing callback to next function */
							callback(null, queryResponse);
						}
					});
				});
				/*
				* Finding the userid from chatlist collection ends.
				*/
			},
			(params, callback) => {
				/* 
				* If user is not Present in the chatlist collection,
				* then insert a New userId and Chatlit for that userId
				*/
				if (params === null) {
					/* Inserting userId and list of ids starts*/
					Mongodb.onConnect((db, ObjectID) => {
						db.collection('chatlist').insertOne({
							userId: userId,
							chatlist: [toUserId]
						}, (err, result) => {
							db.close();
							callback(true, 'queryResponse');
						});
					});
					/* Inserting userId and list of ids starts*/
				} else {
					/* 
					* If user is Present in the chatlist collection,
					* then update the Chatlit for that userId
					*/
					let newChatIDs = params.chatlist;
					/* Updating userId and list of ids starts*/
					if (newChatIDs.indexOf(toUserId)) {
						newChatIDs.push(toUserId);
						Mongodb.onConnect((db, ObjectID) => {
							db.collection('chatlist').findAndModify({ userId: userId }, [], { $set: { chatlist: newChatIDs } }, {}, (err, result) => {
								db.close();
								callback(true, result.value);
							});
						});
					} else {
						callback(true, null);
					}

					/* Updating userId and list of ids ends*/
				}
			}
		], (params, result) => {
			/* insert the message into the messages collection starts*/
			Mongodb.onConnect((db, ObjectID) => {
				db.collection('messages').insertOne(data, (err, result) => {
					db.close();
					callback(err, result);
				});
			});
			/* insert the message into the messages collection ends*/
		});
	}

	/*
	* Name of the Method : insertChatListForFriend
	* Description : To insert a chatlist for the friend.
	* Parameter : 
	*		1) data comprises of message,fromId,toId
	* Return : callback 
	*/
	insertChatListForFriend(data) {
		const Mongodb = this.Mongodb;
		const userId = data.fromUserId;
		const toUserId = data.toUserId;

		async.waterfall([
			(callback) => {
				/*
				* Finding the userid from chatlist collection starts.
				*/
				Mongodb.onConnect((db, ObjectID) => {
					db.collection('chatlist').findOne({ 'userId': toUserId }, (err, queryResponse) => {
						db.close();
						if (queryResponse === null) {
							/* Passing callback to next function */
							callback(null, null);
						} else {
							/* Passing callback to next function */
							callback(null, queryResponse);
						}
					});
				});
				/*
				* Finding the userid from chatlist collection ends.
				*/
			},
			(params, callback) => {
				/* 
				* If user is not Present in the chatlist collection,
				* then insert a New userId and Chatlit for that userId
				*/
				if (params === null) {
					/* Inserting userId and list of ids starts*/
					Mongodb.onConnect((db, ObjectID) => {
						db.collection('chatlist').insertOne({
							userId: toUserId,
							chatlist: [userId]
						}, (err, result) => {
							db.close();
							callback(true, 'queryResponse');
						});
					});
					/* Inserting userId and list of ids starts*/
				} else {
					/* 
					* If user is Present in the chatlist collection,
					* then update the Chatlit for that userId
					*/
					/* Updating userId and list of ids starts*/
					let newChatIDs = params.chatlist;
					if (newChatIDs.indexOf(userId)) {
						newChatIDs.push(userId);
						Mongodb.onConnect((db, ObjectID) => {
							db.collection('chatlist').findAndModify({ userId: toUserId }, [], { $set: { chatlist: newChatIDs } }, {}, (err, result) => {
								db.close();
								callback(err, result.value);
							});
						});
					}
					/* Updating userId and list of ids ends*/
				}
			}
		], (params, result) => {
			//Write Any important code here.....
		});
	}

	/*
	* Name of the Method : getMessages
	* Description : To fetch messages from DB between two users.
	* Parameter : 
	*		1) userId, toUserId
	*		2) callback function
	* Return : callback 
	*/
	getMessages(userId, toUserId, callback) {

		const data = {
			'$or': [
				{
					'$and': [
						{
							'toUserId': userId
						}, {
							'fromUserId': toUserId
						}
					]
				}, {
					'$and': [
						{
							'toUserId': toUserId
						}, {
							'fromUserId': userId
						}
					]
				},
			]
		};
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('messages').find(data).sort({ 'timestamp': 1 }).toArray((err, result) => {
				db.close();
				console.log(result);
				callback(err, result);
			});
		});
	}

	/*
	* Name of the Method : getMessages
	* Description : To fetch messages from DB between two users.
	* Parameter : 
	*		1) userID
	*		2) callback function
	* Return : callback 
	*/
	logout(userID, isSocketId, callback) {

		const data = {
			$set: {
				online: 'N'
			}
		};
		this.Mongodb.onConnect((db, ObjectID) => {

			let condition = {};
			if (isSocketId) {
				condition.socketId = userID;
			} else {
				condition._id = ObjectID(userID);
			}


			db.collection('users').update(condition, data, (err, result) => {
				db.close();
				callback(err, result.result);
			});
		});
	}

	isUserLoggedOut(userSocketId, callback) {
		this.Mongodb.onConnect((db, ObjectID) => {
			db.collection('users').findOne({ socketId: userSocketId }, (error, result) => {
				db.close();
				if (error) {
					callback({ loggedOut: true });
				} else {
					if (result === null) {
						callback({ loggedOut: true });
					} else {
						if (result.online === 'Y') {
							callback({ loggedOut: false });
						} else {
							callback({ loggedOut: true });
						}
					}
				}
			});
		});
	}
}

module.exports = new Helper();