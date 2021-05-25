/**
* @file          server.js
* @description   This file is an entry point for application 
* @requires      {@link https://www.npmjs.com/package/swagger-ui-express|swaggerUi}
* @requires      {@link https://expressjs.com/|express }
* @requires      route        is a reference to initialize route 
* @requires      config       is a reference to get connection with configuration
* @requires      logger       is a reference to save logs in log files
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*-----------------------------------------------------------------------------------------------------*/
const express = require('express');
const dbconnection = require('./config/database.config');
const app = express();
require("dotenv").config();
require("./config/index").set(process.env.NODE_ENV, app);
const config = require("./config/index").get();
const cors = require('cors');
const userRoute = require('./app/routes/user');
const bookRoute = require('./app/routes/book');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/lib/swagger.json');
const logger = require("./config/logger");
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, '../pro/bookstore-frontend/dist')));

// parse requests 
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json 
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen for request
app.listen(config.port, () => {
  logger.info(`CONNECT_SERVER: Connected, server started listening on port : ${config.port}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pro/bookstore-frontend/build/index.html'));
});

new dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).connect();

//Initialize the route
userRoute.routeToUserController(app);
bookRoute.routeToUserController(app);
module.exports = app;

