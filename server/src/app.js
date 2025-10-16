import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import SequelizeStoreFactory from "connect-session-sequelize";
import { sequelize } from "./models/index.js";

import apiRoutes from "./routes/api.routes.js";
import authRoutes from "./routes/auth.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import userRoutes from "./routes/user.routes.js";
import fileRoutes from "./routes/file.routes.js";
import corsWithCreds from "./config/cors.js";

const app = express();

// Trust proxy if behind NGINX/Coolify
app.set("trust proxy", true);
app.use(corsWithCreds());

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Express-session + Sequelize
const SequelizeStore = SequelizeStoreFactory(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions", // Sequelize will create sid, expires, data, createdAt, updatedAt
  checkExpirationInterval: 15 * 60 * 1000, // optional
  expiration: 24 * 60 * 60 * 1000, // 1 day
});

app.use(
  session({
    secret: process.env.AUTH_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Sync the session table
sessionStore.sync();

// Routes
app.use("/api/files", fileRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", inviteRoutes);
app.use("/api", userRoutes);

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

export default app;
