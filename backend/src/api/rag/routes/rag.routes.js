import express from "express";
import { authenticateUser } from "../../../middleware/authentication.js";
import { searchInDocumentValidation } from "../validations/rag.validation.js";
import { searchInDocumentController } from "../controller/rag.controller.js";

const ragRoute = express.Router();

ragRoute.get(
  "/:documentId/search",
  authenticateUser,
import { Router } from "express";
import { authenticateUser } from "../../../middleware/authentication.js";
import { deleteDocumentController } from "../controller/rag.controller.js";
import { deleteDocumentValidation } from "../validations/rag.validation.js";
import {
  handlePdfUpload,
  createDocumentMulterErrorHandler,
} from "../../../middleware/rag.upload.config.js";
import {
  documentIdParamValidation,
  searchInDocumentValidation,
  queryDocumentValidation,
} from "../validations/rag.validation.js";
import {
  getDocumentMetaController,
  listDocumentsController,
  searchInDocumentController,
  createDocumentController,
  queryDocumentController,
} from "../controller/rag.controller.js";

const ragRoutes = Router();

ragRoutes.use(authenticateUser);

ragRoutes.get("/documents", listDocumentsController);

ragRoutes.post(
  "/documents",
  handlePdfUpload,
  createDocumentMulterErrorHandler,
  createDocumentController,
);

ragRoutes.get("/documents/:documentId", documentIdParamValidation, getDocumentMetaController);

ragRoutes.get(
  "/documents/:documentId/search",
  searchInDocumentValidation,
  searchInDocumentController,
);

export default ragRoute;
ragRoutes.post(
  "/documents/:documentId/query",
  queryDocumentValidation,
  queryDocumentController,
);

ragRoutes.delete(
  "/documents/:documentId",
  deleteDocumentValidation,
  deleteDocumentController,
);

export default ragRoutes;
