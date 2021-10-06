const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) =>  {
    const token = req.header('x-auth-token');

    // Error 401 : no credentials provided
    if (!token) return res.status(401).send('Access denied. Token not provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}