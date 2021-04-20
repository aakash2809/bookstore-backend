const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");

class UserRoutes {
  routeToUserController = (app) => {

    // register a new user
    app.post("/user-register", helper.addRole('user'), userControllers.register);

    // register a new user
    app.post("/admin-register", helper.addRole('admin'), userControllers.register);

    // user login
    app.post('/user-login', userControllers.login);

    // admin login
    app.post('/admin-login', userControllers.login);

  };
}

module.exports = new UserRoutes();
