const express = require('express');
const dbconnection = require('./config/database.config');
const app = express();
require("dotenv").config();
require("./config/index").set(process.env.NODE_ENV, app);
const config = require("./config/index").get();
const cors = require('cors');

app.use(cors());

// parse requests 
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json 
app.use(express.json());

// listen for request
app.listen(config.port, () => {
  console.log(`CONNECT_SERVER: Connected, server started listening on port : ${config.port}`);
});

new dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).connect();

module.exports = app;
