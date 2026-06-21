import express from "express";
import { authenticateUser } from "../../../middleware/authentication.js";
import { createDocumentController } from "../controller/rag.controller.js";
import { handlePdfUpload } from "../../../middleware/rag.upload.config.js"; 


const ragRoute = express.Router();

ragRoute.post(
  "/documents",
  authenticateUser, // Step 1: Ensure user is logged in
  handlePdfUpload, // Step 2: Receive and save the multipart/form-data PDF
  createDocumentController, // Step 4: Pass to controller for processing
);
export default ragRoute;
