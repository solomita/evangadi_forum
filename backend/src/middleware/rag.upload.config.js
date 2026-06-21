import multer from "multer";
import { BadRequestError } from "../utils/errors/index.js";

const storage = multer.diskStorage({
  // Step 1: Tell the multer where to save the incoming PDF
  // Passing a string instead of a function allows Multer to create the folder if it doesn't exist.
  destination: "uploads/",
  filename: (req, file, cb) => {
    // Step 2 : Ensure unique filenames to prevent overwriting
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const uploadPdf = multer({
  storage: storage,
  limits: {
    // Limits file size to exactly 10MB as requested
    filesize: 10* 1024 * 1024,
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


