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
const passport = require("passport");
const { Strategy } = require("passport-facebook");

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new Strategy({
  clientID: '343119313226188',
  clientSecret: 'ffc667ae06c3d05a396410c7d8945b90',
  callbackURL: 'http://localhost:4000/fb/auth',
  profileFields: ['id', 'displayName']
},
  function (accessToken, refreshToken, profile, done) {
    // if user exist by id
    // else user ko save krna hai
    const user = {};
    done(null, user);
  }
))

app.use('/login/fb', passport.authenticate('facebook'));


app.use('/failed/login', (req, res, next) => {
  res.send('login failed');
});

app.use('/fb/auth', passport.authenticate('facebook',
  { failureRedirect: '/failed/login' }), function (req, res) {
    res.send('logged in to facebook');
  });

app.use('/logout', (req, res, next) => {
  req.logout();
  console.log(req.isAuthenticated());
  res.send('user is logged out');
})

//Initialize the route
userRoute.routeToUserController(app);
bookRoute.routeToUserController(app);

module.exports = app;

