const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const analyzeLimited = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  keyGenerator: (res, req) =>
    req.user?._id?.toString() || ipKeyGenerator(res, req),
  message: {
    error: {
      message: "Too many analyses - Please wait a minute and retry",
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  keyGenerator: (res, req) =>
    req.user?._id?.toString() || ipKeyGenerator(res, req),
  message: {
    error: {
      message: "Too many auth attemps - Please wait a minute and retry",
    },
  },
});

module.exports = { analyzeLimited, authLimiter };
