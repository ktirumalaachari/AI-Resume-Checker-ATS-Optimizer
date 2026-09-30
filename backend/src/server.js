// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const morgan = require("morgan");

// const env = require("./config/env");
// const { connectDB } = require("./config/db");
// const { notFound, errorHandler } = require("./middleware/errorHandler");

// const healthRouter = require("./routes/health");
// const authRouter = require("./routes/auth");
// const resumesRouter = require("./routes/resumes");
// const dashboardRouter = require("./routes/dashboard");
// const insightsRouter = require("./routes/insights");
// const versionsRouter = require("./routes/versions");
// const historyRouter = require("./routes/history");

// // ...

// const app = express();

// app.set("trust proxy", 1);

// app.use(
//   cors({
//     origin: true, // Reflect request origin
//     credentials: true,
//   }),
// );

// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use(cookieParser());

// if (!env.config.isProd) {
//   app.use(morgan("dev"));
// }

// app.use("/api/health", healthRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/resumes", resumesRouter);

// app.use("/api/dashboard", dashboardRouter);
// app.use("/api/insights", insightsRouter);
// app.use("/api/versions", versionsRouter);
// app.use("/api/history", historyRouter);

// // 404 Handler
// app.use(notFound);

// // Global Error Handler
// app.use(errorHandler);

// async function start() {
//   // console.log("Health router loaded:", healthRouter);
//   try {
//     await connectDB();
//     app.listen(env.config.port, () => {
//       console.log(`Server running on port ${env.config.port}`);
//     });
//   } catch (err) {
//     console.error("Failed to start the server: ", err.message);
//     process.exit(1);
//   }
// }

// process.on("unhandledRejection", (reason) => {
//   console.error("Unhandled rejection:", reason);
// });

// start();

// module.exports = app;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { config } = require("./config/env");
const { connectDB } = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const resumesRouter = require("./routes/resumes");
const dashboardRouter = require("./routes/dashboard");
const insightsRouter = require("./routes/insights");
const versionsRouter = require("./routes/versions");
const historyRouter = require("./routes/history");

const app = express();

app.set("trust proxy", 1);

/*
  CORS
*/
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin
      // e.g. Postman, server-to-server, health checks
      if (!origin) {
        return callback(null, true);
      }

      if (config.clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,
  }),
);

/*
  Body parsers
*/
app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

/*
  Local logging
*/
if (!config.isProd) {
  app.use(morgan("dev"));
}

/*
  MongoDB middleware

  This ensures Vercel can reuse the Express app
  while connecting to MongoDB only when needed.
*/
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    next(error);
  }
});

/*
  Root route
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Checker API is running",
  });
});

/*
  API routes
*/
app.use("/api/health", healthRouter);

app.use("/api/auth", authRouter);

app.use("/api/resumes", resumesRouter);

app.use("/api/dashboard", dashboardRouter);

app.use("/api/insights", insightsRouter);

app.use("/api/versions", versionsRouter);

app.use("/api/history", historyRouter);
console.log({
  healthRouter: typeof healthRouter,
  authRouter: typeof authRouter,
  resumesRouter: typeof resumesRouter,
  dashboardRouter: typeof dashboardRouter,
  insightsRouter: typeof insightsRouter,
  versionsRouter: typeof versionsRouter,
  historyRouter: typeof historyRouter,
});
/*
  404
*/
app.use(notFound);

/*
  Global Error Handler
*/
app.use(errorHandler);

/*
  Local development only.

  Vercel imports/uses the exported Express app,
  so do not force app.listen() in production.
*/
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed on startup:", err.message);
    });
}

/*
  Required for Vercel/CommonJS
*/
module.exports = app;