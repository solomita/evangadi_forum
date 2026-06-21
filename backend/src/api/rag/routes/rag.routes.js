import express from "express";

import { authenticateUser as authenticate } from "../../../middleware/authentication.js";

import { deleteDocumentController } from "../controller/rag.controller.js";
import { deleteDocumentValidation } from "../validations/rag.validation.js";

const router = express.Router();

router.use(authenticate);

router.delete(
  "/documents/:documentId",
  deleteDocumentValidation,
  deleteDocumentController,
);

export default router;
