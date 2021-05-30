const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");
const passport = require("passport");
const SocialLoginmiddleware = require("../middlewares/googleAuth");

class UserRoutes {
  routeToUserController = (app) => {

    // register a new user
    app.post("/userRegister", helper.addRole('user'), userControllers.register);

    // register a new user
    app.post("/adminRegister", helper.addRole('admin'), userControllers.register);

    // user login
    app.post('/userLogin', userControllers.login);

    // admin login
    app.post('/adminLogin', userControllers.login);

    //forgot password
    app.post("/forgotPassword", userControllers.forgotPassword);

    //social login
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail' }),
      (req, res, next) => {
        let googleProfile = req.user;
        let googleInfo = {
          firstName: googleProfile.name.givenName,
          lastName: googleProfile.name.familyName,
          email: googleProfile.emails[0].value,
          password: null,
          googleId: googleProfile.id,
        };
        console.log("user information", googleInfo);
        res.send('user is logged in');
      })


    app.get('/auth/fail', (req, res, next) => {
      res.send('user logged in failed');
    });

    app.get('/logout', (req, res, next) => {
      req.logout();
      res.send('user is logged out');
    });

  };
}

module.exports = new UserRoutes();
