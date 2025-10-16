// ./config/cors.js
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins =
  process.env.FRONTEND_URL?.split(",").map((s) => s.trim()) || [];

console.log("Allowed Origins:", allowedOrigins);

export default function corsWithCreds() {
  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow curl/Postman/etc
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("❌ CORS blocked:", origin);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // allow cookies
    optionsSuccessStatus: 200,
  });
}
