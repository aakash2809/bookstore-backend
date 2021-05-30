const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");
const passport = require("passport");

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

  };
}

module.exports = new UserRoutes();
