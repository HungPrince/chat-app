'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const socketEvents = require('./utils/socket');
const routes = require('./utils/routes');
const config = require('./utils/config');


class Server {

    constructor() {
        this.port = process.env.PORT || 4000;
        this.host = `localhost`;

        this.app = express();
        this.app.use(bodyParser.json());
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig() {
        console.log('in config construct');
        this.app.use(
            bodyParser.json()
        );
        this.app.use(
            cors()
        );
        this.app.use(
            fileUpload()
        );

        new config(this.app);
    }

    /* Including app Routes starts*/
    includeRoutes() {
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }
    /* Including app Routes ends*/

    appExecute() {

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }
}

const app = new Server();
app.appExecute();