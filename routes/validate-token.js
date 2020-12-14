const jwt = require("jsonwebtoken");

// middleware to validate token
const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access denied" });
  if(token.startsWith('Bearer ')){
    token = token.slice(7, token.length)
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token is not valid" });
  }
};

module.exports = verifyToken;