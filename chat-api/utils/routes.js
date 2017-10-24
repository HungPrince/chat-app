'use strict';

const helper = require('./helper');
const path = require('path');
var bodyParser = require('body-parser');

class Routes {

	constructor(app) {

		this.app = app;
	}

	appRoutes() {

		this.app.get('/getListUser', (request, response) => {
			helper.getListUser((lstUser) => {
				console.log(lstUser);
				response.status(200).json(lstUser);
			});
		});

		this.app.post('/usernameCheck', (request, response) => {
			console.log(request.body);
			console.log(request.query);
			if (request.body.username === "") {
				response.status(412).json({
					error: true,
					message: `username can't be empty.`
				});
			} else {
				helper.userNameCheck({
					username: request.body.username.toLowerCase()
				}, (count) => {

					let result = {};

					if (count > 0) {
						result.error = true;
						result.message = 'This username is alreday taken.';
						response.status(401).json(result);
					} else {
						result.error = false;
						result.message = 'This username is available.';
						response.status(200).json(result);
					}
				});
			}
		});

		this.app.post('/registerUser', (request, response) => {
			const data = {
				username: (request.body.username).toLowerCase(),
				email: request.body.email,
				password: request.body.password
			};

			let registrationResponse = {}

			if (data.username === '') {

				registrationResponse.error = true;
				registrationResponse.message = `username cant be empty.`;
				response.status(412).json(registrationResponse);

			} else if (data.email === '') {

				registrationResponse.error = true;
				registrationResponse.message = `email cant be empty.`;
				response.status(412).json(registrationResponse);

			} else if (data.password === '') {

				registrationResponse.error = true;
				registrationResponse.message = `password cant be empty.`;
				response.status(412).json(registrationResponse);

			} else {

				data.timestamp = Math.floor(new Date() / 1000);
				data.online = 'Y';
				data.socketId = '';

				helper.registerUser(data, (error, result) => {

					if (error) {

						registrationResponse.error = true;
						registrationResponse.message = `User registration unsuccessful,try after some time.`;
						response.status(417).json(registrationResponse);
					} else {

						registrationResponse.error = false;
						registrationResponse.userId = result.insertedId;
						registrationResponse.message = `User registration successful.`;
						response.status(200).json(registrationResponse);
					}
				});
			}
		});

		this.app.post('/login', (request, response) => {

			const data = {
				username: (request.body.username).toLowerCase(),
				password: request.body.password
			};

			let loginResponse = {}

			if (data.username === '' || data.username === null) {

				loginResponse.error = true;
				loginResponse.message = `username cant be empty.`;
				response.status(412).json(loginResponse);

			} else if (data.password === '' || data.password === null) {

				loginResponse.error = true;
				loginResponse.message = `password cant be empty.`;
				response.status(412).json(loginResponse);

			} else {

				helper.login(data, (error, result) => {

					if (error || result === null) {

						loginResponse.error = true;
						loginResponse.message = `Invalid username and password combination.`;
						response.status(401).json(loginResponse);
					} else {
						loginResponse.error = false;
						loginResponse.userId = result._id;
						loginResponse.message = `User logged in.`;
						response.status(200).json(loginResponse);
					}
				});
			}
		});

		this.app.post('/upload', (request, response) => {
			console.log(request.files);
			if (!request.files)
				return response.status(400).send('No file were uploaded!');

			let file = request.files.txtImage;
			file.mv('upload/' + new Date().getTime() + '.jpg', err => {
				if (err)
					return response.status(500).send(err);
				response.json({ "status": true, "message": "file uploaded" });
			});
		});

		this.app.post('/userSessionCheck', (request, response) => {

			let userId = request.body.userId;
			let sessionCheckResponse = {}

			if (userId == '') {

				sessionCheckResponse.error = true;
				sessionCheckResponse.message = `User Id cant be empty.`;
				response.status(412).json(sessionCheckResponse);

			} else {

				helper.userSessionCheck({
					userId: userId,
				}, (error, result) => {

					if (error || result === null) {

						sessionCheckResponse.error = true;
						sessionCheckResponse.message = `User is not logged in.`;
						response.status(401).json(sessionCheckResponse);
					} else {

						sessionCheckResponse.error = false;
						sessionCheckResponse.username = result.username;
						sessionCheckResponse.message = `User logged in.`;
						response.status(200).json(sessionCheckResponse);
					}
				});
			}
		});

		this.app.post('/getMessages', (request, response) => {

			let userId = request.body.userId;
			let toUserId = request.body.toUserId;
			console.log(request.body);
			let messages = {}

			if (userId == '') {
				messages.error = true;
				messages.message = `userId cant be empty.`;
				response.status(200).json(messages);
			} else {

				helper.getMessages(userId, toUserId, (error, result) => {

					if (error) {

						messages.error = true;
						messages.message = `Internal Server error.`;
						response.status(500).json(messages);

					} else {

						messages.error = false;
						messages.messages = result;
						response.status(200).json(messages);
					}
				});
			}
		});

		this.app.post('/getUsersToChat', (request, response) => {

			let userId = request.body.userId;
			let chatList = {}

			if (userId == '') {
				chatList.error = true;
				chatList.message = `userId cant be empty.`;
				response.status(200).json(chatList);
			} else {

				helper.getUsersToChat(userId, (error, result) => {
					if (error) {

						chatList.error = true;
						chatList.message = `Internal server error.`;
						response.status(500).json(chatList);

					} else {

						chatList.error = false;
						chatList.chatList = result;
						response.status(200).json(chatList);
					}
				});
			}
		});

		this.app.get('*', (request, response) => {
			response.sendFile(path.join(__dirname, '../index.html'));
		});

	}

	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;