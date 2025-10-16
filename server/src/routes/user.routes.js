// routes/user.route.js
import express from "express";
import { getUsers, getUserById } from "../controllers/user.controller.js";

const router = express.Router();

// Admin-only list endpoint
router.get("/users", getUsers);
router.get("/users/:id", getUserById); // get a specific user (self/admin)
export default router;
