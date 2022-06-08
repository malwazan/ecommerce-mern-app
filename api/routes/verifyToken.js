const jwt = require("jsonwebtoken");



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const tokenArr = authHeader.split(" ")
        const token = tokenArr[tokenArr.length - 1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        })

    } else {
        return res.status(401).json("You are not authenticated!")
    }
}


const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to update the user!");
        }
    });
}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("you do not have sufficient permissions for the request!");
        }
    });
}


module.exports = { 
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};