const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
require('dotenv').config();

passport.use(new Strategy({
    clientID: process.env.GOOGLE_ACCOUNT_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ACCOUNT_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback',
},
    ((accessToken, refreshToken, profile, done) => {
        const userDetails = {
            profile,
            token: accessToken,
        };
        return done(null, userDetails);
    })));
