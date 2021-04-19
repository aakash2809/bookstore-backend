
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
}

module.exports = new Helper();
