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
//const { Strategy } = require("passport-facebook");
const { Strategy } = require("passport-google-oauth20");

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
  clientID: '775502779154-lj0udmhe6hm4m4lu90kdjg7h7gpuupim.apps.googleusercontent.com',
  clientSecret: 'GjnhsoOKx5ivv0p9cPF8ZgBI',
  callbackURL: 'http://localhost:4000/auth/google/callback'
},
  function (accessToken, refreshToken, profile, email, done) {
    // if user already exist in your dataabse login otherwise
    // save data and 

    done(null, {});
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  (req, res, next) => {

    console.log("user profile", req);
    res.send('user is logged in');
  })

app.get('/auth/fail', (req, res, next) => {
  res.send('user logged in failed');
});

app.get('/logout', (req, res, next) => {
  req.logout();
  res.send('user is logged out');
});

//Initialize the route
userRoute.routeToUserController(app);
bookRoute.routeToUserController(app);

module.exports = app;

