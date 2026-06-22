import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateUser } from "../../../middleware/authentication.js";
import { UPLOADS_DIR } from "../service/rag.storage.js";
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  searchDocument,
  queryDocument,
  getDocumentFile,
} from "../controller/rag.controller.js";

const router = express.Router();

// Ensure the uploads directory exists before multer tries to use it.
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.use(authenticateUser);

router.get("/documents", listDocuments);
router.post("/documents", upload.single("file"), uploadDocument);
router.delete("/documents/:id", deleteDocument);
router.get("/documents/:id/search", searchDocument);
router.post("/documents/:id/query", queryDocument);
router.get("/documents/:id/file", getDocumentFile);

export default router;
