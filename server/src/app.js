import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import SequelizeStoreFactory from "connect-session-sequelize";
import { sequelize } from "./models/index.js";

// Routes
import apiRoutes from "./routes/api.routes.js";
import authRoutes from "./routes/auth.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import userRoutes from "./routes/user.routes.js";
import fileRoutes from "./routes/file.routes.js";

// CORS config
import corsWithCreds from "./config/cors.js";

const app = express();

// --- 🔧 1. TRUST PROXY (for cookies behind proxy)
app.set("trust proxy", true);

// --- 🧩 2. CORS FIRST (before helmet/express.json)
app.use(corsWithCreds());

// --- 🧩 3. Handle OPTIONS preflight for all routes
app.options("*", corsWithCreds());

// --- 🧱 4. Security and middleware stack
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// --- 🧠 5. Session setup
const SequelizeStore = SequelizeStoreFactory(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Sessions",
  checkExpirationInterval: 15 * 60 * 1000, // clean expired sessions
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Sync session table
sessionStore.sync();

// --- 🚏 6. Mount routes
app.use("/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", apiRoutes);
app.use("/api", inviteRoutes);
app.use("/api", userRoutes);

// --- 🚨 7. Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
