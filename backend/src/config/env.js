// const dotenv = require("dotenv");
// const path = require("path");

// dotenv.config({
//   path: path.resolve(__dirname, "../../.env"),
// });

// const required = ["MONGO_URI", "JWT_SECRET"];

// const missing = required.filter((key) => !process.env[key]);

// if (missing.length) {
//   console.error(
//     `Missing required environment variables: ${missing.join(", ")}`,
//   );
//   // process.exit(1);
// }

// const config = {
//   nodeEnv: process.env.NODE_ENV || "development",

//   port: Number(process.env.PORT) || 5000,

//   mongoUri: process.env.MONGO_URI,

//   jwtSecret: process.env.JWT_SECRET,

//   jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

//   cookieName: process.env.COOKIE_NAME || "arr_token",

//   clientOrigins: (
//     process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174"
//   )
//     .split(",")
//     .map((o) => o.trim())
//     .filter(Boolean),

//   geminiApiKey: process.env.GEMINI_API_KEY || "",

//   geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",

//   isProd: process.env.NODE_ENV === "production",
// };

// module.exports = { config };
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI || "",

  jwtSecret: process.env.JWT_SECRET || "",

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  cookieName: process.env.COOKIE_NAME || "arr_token",

  clientOrigins: (
    process.env.CLIENT_ORIGIN ||
    "https://ai-resume-checker-trk.vercel.app/,http://localhost:5173,http://localhost:5174"
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  geminiApiKey: process.env.GEMINI_API_KEY || "",

  geminiModel: process.env.GEMINI_MODEL || "gemini-3.5-flash",

  isProd: process.env.NODE_ENV === "production",
};

if (!config.mongoUri) {
  console.error("WARNING: MONGO_URI is missing");
}

if (!config.jwtSecret) {
  console.error("WARNING: JWT_SECRET is missing");
}

module.exports = {
  config,
};
