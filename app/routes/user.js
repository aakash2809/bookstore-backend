const userControllers = require(`../controllers/user`);
//const helper = require("../middlewares/helper");

class UserRoutes {
  routeToUserController = (app) => {
    app.post("/register", userControllers.register);

  };
}

module.exports = new UserRoutes();
