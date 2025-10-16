import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";
import {
  ensureSeedFromMAP,
  getAccessControl,
} from "./services/rbac.service.js";

dotenv.config();

const port = process.env.PORT || 4000;
const authUrl = process.env.AUTH_URL || `http://localhost:${port}`;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Seed RBAC tables at runtime (idempotent) and build AC grants
    await ensureSeedFromMAP();
    getAccessControl(); // init singleton
  } catch (e) {
    console.error("❌ Startup error:", e);
  }

  app.listen(port, () => {
    console.log(`API listening at ${authUrl}`);
    console.log("Allowed origins:", process.env.FRONTEND_URL);
  });
})();
