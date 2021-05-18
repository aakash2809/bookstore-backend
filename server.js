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
var multer = require('multer')
var upload = multer({ dest: 'uploads/' });
const logger = require("./config/logger");

app.use(cors());

// parse requests 
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json 
app.use(express.json());



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen for request
app.listen(config.port, () => {
  logger.info(`CONNECT_SERVER: Connected, server started listening on port : ${config.port}`);
});

new dbconnection(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).connect();

//Initialize the route
userRoute.routeToUserController(app);
bookRoute.routeToUserController(app);
module.exports = app;

