class AuthMiddleware {
    authenticateToken = (req, res, next) => {
        console.log("req.user.token");
        if (req.user.token) {
            next();
        } else {
            let response = {};
            response.status = false
            response.message = 'Failed To Set Google Token...!'
            return res.status(400).send(response)
        }
    };
}

module.exports = new AuthMiddleware();
