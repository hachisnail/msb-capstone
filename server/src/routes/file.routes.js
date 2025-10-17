import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requirePerm from "../middleware/requirePerm.js";
import { verifyAccessToken } from "../middleware/tokenAuth.js";
import { createFileUploader } from "../middleware/upload.js";
import { fileController } from "../controllers/file.controller.js";

const router = express.Router();

// == INTERNAL, SESSION-BASED UPLOAD ROUTES ==

router.post(
  "/articles",
  requireAuth,
  requirePerm("articles.create"),
  ...createFileUploader({ category: "articles", privacy: "public" }),
  fileController.uploadArticleFile,
);

router.post(
  "/acquisitions",
  requireAuth,
  requirePerm("acquisitions.create"),
  ...createFileUploader({ category: "acquisitions", privacy: "private" }),
  fileController.uploadAcquisitionFile,
);

router.post(
  "/inventory",
  requireAuth,
  requirePerm("inventory.create"),
  ...createFileUploader({ category: "inventory", privacy: "private" }),
  fileController.uploadInventoryFile,
);

// == PUBLIC, TOKEN-BASED UPLOAD ROUTE ==
router.post(
  "/public/submissions",
  verifyAccessToken("write"),
  ...createFileUploader({ category: "submissions", privacy: "private" }),
  fileController.uploadPublicSubmission,
);

// == UNIVERSAL FILE ACCESS ROUTE ==
router.get("/:filename", fileController.getFileByName);

export default router;
