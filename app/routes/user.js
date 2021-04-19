const userControllers = require(`../controllers/user`);
const helper = require("../middlewares/helper");

class UserRoutes {
  routeToUserController = (app) => {

    // register a new user
    app.post("/user-register", helper.addRole('user'), userControllers.register);

    // register a new user
    app.post("/admin-register", helper.addRole('admin'), userControllers.register);

  };
}

module.exports = new UserRoutes();
