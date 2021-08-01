const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("No token is provided");
  try {
    let result = jwt.verify(token, "secret_key");
    req.id = result;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports = authenticateToken;
