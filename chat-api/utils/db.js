/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/

"use strict";
/*requiring mongodb node modules */
const mongodb = require('mongodb');
const assert = require('assert');

class Db {

	constructor() {
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
		this.mongoURL = `mongodb://127.0.0.1:27017/local`;
	}

	onConnect(callback) {
		this.mongoClient.connect(this.mongoURL, (err, db) => {
			console.log("connected database");
			assert.equal(null, err);
			callback(db, this.ObjectID);
		});
	}
}
module.exports = new Db();