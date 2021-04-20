const express = require('express');
const dbconnection = require('./config/database.config');
const app = express();
require("dotenv").config();
require("./config/index").set(process.env.NODE_ENV, app);
const config = require("./config/index").get();
const cors = require('cors');
const userRoute = require('./app/routes/user');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/lib/swagger.json');

app.use(cors());

// parse requests 
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json 
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen for request
app.listen(config.port, () => {
  console.log(`CONNECT_SERVER: Connected, server started listening on port : ${config.port}`);
});

new dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).connect();

//Initialize the route
userRoute.routeToUserController(app);
module.exports = app;
