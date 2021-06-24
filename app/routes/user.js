const passport = require('passport');
const userControllers = require('../controllers/user');
const helper = require('../middlewares/helper');
const { authenticateToken } = require('../middlewares/googleAuth');

class UserRoutes {
  routeToUserController = (app) => {
    // register a new user
    app.post('/userRegister', helper.addRole('user'), userControllers.register);

    // register a new user
    app.post('/adminRegister', helper.addRole('admin'), userControllers.register);

    // user login
    app.post('/userLogin', userControllers.login);

    // admin login
    app.post('/adminLogin', userControllers.login);

    // forgot password
    app.post('/forgotPassword', userControllers.forgotPassword);

    // social  user login
    app.get('/googleLogin', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', helper.addRole('user'), passport.authenticate('google', { failureRedirect: '/auth/fail' }),
      authenticateToken, userControllers.socialLogin);

    app.get('/auth/fail', (req, res) => {
      console.log('loggged fail');
      res.send('user logged in failed');
    });

    app.get('/logout', (req, res, next) => {
      req.logout();
      res.send('user is logged out');
    });
  };
}

module.exports = new UserRoutes();
