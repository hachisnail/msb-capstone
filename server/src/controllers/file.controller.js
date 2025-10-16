import path from "path";
import { models } from "../models/index.js";

// Controller for successful, authenticated file uploads
function handleUploadSuccess(req, res, message) {
  if (!req.file || !req.file.dbData) {
    return res
      .status(400)
      .json({ message: "File upload failed or data is missing." });
  }
  return res.status(201).json({ message, file: req.file.dbData });
}

// Controller for successful public submission uploads
async function handlePublicUploadSuccess(req, res, next) {
  if (req.accessToken) {
    // Increment the token's usage count after the file is successfully saved
    await req.accessToken.increment("use_count").catch(next);
  }
  res.status(201).json({
    message: "Your file has been submitted!",
    file: { filename: req.file.dbData.filename }, // Only return the filename for public submissions
  });
}

// Universal controller for accessing any file by its filename
async function getFileByName(req, res, next) {
  try {
    const { filename } = req.params;
    const file = await models.File.findOne({ where: { filename } });

    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const absolutePath = path.resolve(file.file_path);

    // PRIORITY 1: Check for a valid 'read' token in query params
    if (req.query.token) {
      const token = await models.AccessToken.findOne({
        where: { token: req.query.token },
      });
      if (token) {
        const isValid =
          token.scope === "read" &&
          (!token.expires_at || new Date() < new Date(token.expires_at)) &&
          (token.max_uses === null || token.use_count < token.max_uses);

        if (isValid) {
          await token.increment("use_count");
          return res.sendFile(absolutePath);
        }
      }
    }

    // PRIORITY 2: Check for public files
    if (file.privacy === "public") {
      return res.sendFile(absolutePath);
    }

    // PRIORITY 3: Fallback to user session for private files
    const session = req.session || (req.auth && req.auth.session);
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userPerms = new Set(session.user.perms || []);
    const requiredPermission = `${file.category}.read`;
    if (userPerms.has(requiredPermission)) {
      return res.sendFile(absolutePath);
    }

    return res.status(403).json({ message: "Forbidden: Access denied." });
  } catch (error) {
    next(error);
  }
}

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
