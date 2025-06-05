const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, "THE_VANSH");
      
        req.user = { id: data.userId }; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchuser;