const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(payload) {
  return jwt.sign(payload, env.config.jwtSecret, {
    expiresIn: env.config.jwtExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.config.jwtSecret);
}

const cookieOptions = {
  httpOnly: true,
  secure: env.config.isProd,
  sameSite: env.config.isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
module.exports = { signToken, verifyToken, cookieOptions };
