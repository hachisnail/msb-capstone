import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { models } from "../models/index.js";

// ---  Resolve absolute upload root path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, "../../../uploads");

// ---  Helper for upload success responses
function handleUploadSuccess(req, res, message) {
  if (!req.file || !req.file.dbData) {
    return res
      .status(400)
      .json({ message: "File upload failed or data is missing." });
  }
  return res.status(201).json({ message, file: req.file.dbData });
}

// ---  Public submission upload handler
async function handlePublicUploadSuccess(req, res, next) {
  if (req.accessToken) {
    await req.accessToken.increment("use_count").catch(next);
  }
  res.status(201).json({
    message: "Your file has been submitted!",
    file: { filename: req.file.dbData.filename },
  });
}

// ---  Main file access controller with privacy enforcement
async function getFileByName(req, res, next) {
  try {
    const { filename } = req.params;
    const file = await models.File.findOne({ where: { filename } });

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const absolutePath = path.join(UPLOAD_ROOT, file.category, file.filename);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File missing on disk." });
    }

    // ---  Privacy Layers ---

    // 1️ Token-based (temporary or public links)
    if (req.query.token) {
      const token = await models.AccessToken.findOne({
        where: { token: req.query.token },
      });

      if (token) {
        const valid =
          token.scope === "read" &&
          (!token.expires_at || new Date() < new Date(token.expires_at)) &&
          (token.max_uses === null || token.use_count < token.max_uses);

        if (valid) {
          await token.increment("use_count");
          return res.sendFile(absolutePath);
        }
      }
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // 2️ Public files (open access)
    if (file.privacy === "public") {
      return res.sendFile(absolutePath);
    }

    // 3️ Private files (requires logged-in user + permission)
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hasPerm = user.perms?.includes(`${file.category}.read`);
    if (!hasPerm) {
      return res.status(403).json({ message: "Forbidden: Access denied." });
    }

    return res.sendFile(absolutePath);
  } catch (error) {
    console.error("File access error:", error);
    next(error);
  }
}

// ---  Export controller object
export const fileController = {
  uploadArticleFile: (req, res) =>
    handleUploadSuccess(req, res, "Article file uploaded!"),
  uploadAcquisitionFile: (req, res) =>
    handleUploadSuccess(req, res, "Acquisition document uploaded!"),
  uploadInventoryFile: (req, res) =>
    handleUploadSuccess(req, res, "Inventory file uploaded!"),
  uploadPublicSubmission: handlePublicUploadSuccess,
  getFileByName,
};
