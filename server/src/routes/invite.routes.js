// routes/invite.route.js
import express from "express";
import { sendInvite, getInvites } from "../controllers/invite.controller.js";
import {
  acceptInvite,
  getInviteDetails,
} from "../controllers/acceptInvite.controller.js";

const router = express.Router();

// Admin-only routes
router.post("/invite", sendInvite);
router.get("/invites", getInvites);

// Public endpoint
router.get("/accept-invite", getInviteDetails);
router.post("/accept-invite", acceptInvite);

export default router;
