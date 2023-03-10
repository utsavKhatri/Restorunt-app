const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
/**
 * This is a middleware function.
 * @param {token} req
 * @return procced
 * @rejects {Error}
 */
module.exports = async (req, res, next) => {
  try {
    // Extract the token from req session
    if (req.headers["authorization"]===null) {
      return res.status(401).send("Unauthorized");
    }
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    // Verify the token
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).send("Forbidden");
      }
      // Add the decoded token to the request object
      req.admin = decodedToken;
      console.log("====================================");
      console.log(req.admin);
      console.log("====================================");
      if (req.admin) {
        return next();
      }
      return res.status(403).send("Forbidden");
      // Call the next middleware or route handler
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send("Forbidden");
  }
};
