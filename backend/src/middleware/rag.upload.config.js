import multer from "multer";
import { BadRequestError } from "../utils/errors/index.js";
import fs from "fs";

const storage = multer.diskStorage({
  // Step 1: Tell the multer where to save the incoming PDF

  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Step 2 : Ensure unique filenames to prevent overwriting
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = Date.now() + "-" + sanitizedName;
    cb(null, uniqueName);
  },
});
const uploadPdf = multer({
  storage: storage,
  limits: {
    // Limits file size to exactly 10MB as requested
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // step 3: Check that the file is an actual PDF
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new BadRequestError("only PDF files are allowed."));
    }
    cb(null, true);
  },
}).single("file");
// Step 4: Wrapper middleware to execute uploadPdf

export const handlePdfUpload = async (req, res, next) => {
  uploadPdf(req, res, (err) => {
    if (err) {
      return next(err); // Pass the error to the specific error handler
    }
    next();
  });
};

export const createDocumentMulterErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({
          success: false,
          error: "File too large. Maximum size is 10MB.",
        });
    }
    return res.status(400).json({ success: false, error: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
};