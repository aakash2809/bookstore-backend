const jwt = require("jsonwebtoken");
require("dotenv").config();

class Helper {
    /**
      * @description verify the user to authorized user's role
      * @param {*} req
      * @param {*} res
      * @param {*} next
      */
    addRole = (role) => {
        return (req, res, next) => {
            req.role = role;
            next();
        }
    };

    /**
     * @description it genrate the token
     */
    genrateToken = (user) => {
        return jwt.sign(
            {
                role: user.role,
                userId: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );
    };
}

module.exports = new Helper();
