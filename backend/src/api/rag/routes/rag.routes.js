
import { Router } from "express";
import { authenticateUser } from "../../../middleware/authentication.js";
import { documentIdParamValidation } from "../validations/rag.validation.js";
import { getDocumentMetaController } from "../controller/rag.controller.js";
const ragRoutes = Router();
// Define RAG routes here
ragRoutes.get("/documents/:documentId",
   authenticateUser,
    documentIdParamValidation,
    getDocumentMetaController);

export default ragRoutes;