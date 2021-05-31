class AuthMiddleware {
    authenticateToken = (req, res, next) => {
        if (req.user.token) {
            next();
        } else {
            const response = {};
            response.status = false;
            response.message = 'Failed To Set Google Token...!';
            return res.status(400).send(response);
        }
    };
}

module.exports = new AuthMiddleware();
