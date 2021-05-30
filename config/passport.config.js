const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

passport.use(new Strategy({
    clientID: '775502779154-lj0udmhe6hm4m4lu90kdjg7h7gpuupim.apps.googleusercontent.com',
    clientSecret: 'GjnhsoOKx5ivv0p9cPF8ZgBI',
    callbackURL: 'http://localhost:4000/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        // if user already exist in your dataabse login otherwise
        // save data and 
        return done(null, profile);

    }
));