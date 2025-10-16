import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { models } from "../models/index.js";

const UPLOAD_DIRECTORY = path.join(process.cwd(), "uploads");

export function createFileUploader({ category, privacy = "private" }) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const categoryPath = path.join(UPLOAD_DIRECTORY, category);
      fs.mkdirSync(categoryPath, { recursive: true });
      cb(null, categoryPath);
    },
    filename: (req, file, cb) => {
      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFilename);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
  });

  const recordFileInDB = async (req, res, next) => {
    if (!req.file) return next();

    try {
      const { originalname, mimetype, filename, size } = req.file;
      const { associated_record_id, associated_table_name } = req.body;

      const fileRecord = await models.File.create({
        original_name: originalname,
        mimetype,
        filename,
        file_path: path.join("uploads", category, filename),
        size,
        privacy,
        category,
        uploader_id: req.session?.user?.id || null,
        associated_record_id: associated_record_id || null,
        associated_table_name: associated_table_name || null,
      });

      req.file.dbData = fileRecord.toJSON();
      next();
    } catch (dbError) {
      console.error("Failed to save file metadata:", dbError);
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting orphaned file:", err);
      });
      next(new Error("Could not save file information."));
    }
  };

  return [upload.single("file"), recordFileInDB];
}
