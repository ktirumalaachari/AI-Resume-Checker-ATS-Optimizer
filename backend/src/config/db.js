// const mongoose = require("mongoose");

// const { config } = require("./env");

// mongoose.set("strictQuery", true);

// async function connectDB() {
//   //   console.log("Mongo URI:", config.mongoUri);
//   const conn = await mongoose.connect(config.mongoUri, {
//     serverSelectionTimeoutMS: 10_000,
//   });

//   console.log(
//     `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
//   );

//   mongoose.connection.on("error", (err) => {
//     console.error("MongoDB error:", err.message);
//   });

//   mongoose.connection.on("disconnected", () => {
//     console.warn("MongoDB Disconnected");
//   });
// }

// module.exports = { connectDB };
const dns = require("dns");
const mongoose = require("mongoose");

// Fix querySrv ECONNREFUSED when local Windows / router DNS blocks MongoDB Atlas SRV queries
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore in environments where setting DNS servers is restricted
}

const { config } = require("./env");

mongoose.set("strictQuery", true);

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log(
          `MongoDB connected: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`,
        );

        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    throw error;
  }
}

module.exports = {
  connectDB,
};