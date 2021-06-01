const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
require('dotenv').config();

passport.use(new Strategy({
    clientID: process.env.GOOGLE_ACCOUNT_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ACCOUNT_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    ((accessToken, refreshToken, profile, done) => {
        const userDetails = {
            profile,
            token: accessToken,
        };
        return done(null, userDetails);
    })));
