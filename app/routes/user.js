const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");

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

  };
}

module.exports = new UserRoutes();
