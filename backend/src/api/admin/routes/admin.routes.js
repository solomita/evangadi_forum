import express from "express";
import { param } from "express-validator";
import { authenticateUser as authenticate } from "../../../middleware/authentication.js";
import { requireAdmin } from "../../../middleware/admin.js";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";
import {
  getAdminQueueController,
  approvePostController,
  removePostController,
  escalatePostController,
} from "../controller/admin.controller.js";

const router = express.Router();

// All admin routes require a valid JWT and admin role.
router.use(authenticate, requireAdmin);

const postIdValidation = [
  param("postId")
    .isInt({ min: 1 })
    .withMessage("postId must be a positive integer")
    .toInt(),
  validationErrorHandler,
];

// GET  /api/admin/queue
router.get("/queue", getAdminQueueController);

// POST /api/admin/queue/:postId/approve
router.post("/queue/:postId/approve", postIdValidation, approvePostController);

// POST /api/admin/queue/:postId/remove
router.post("/queue/:postId/remove", postIdValidation, removePostController);

// POST /api/admin/queue/:postId/escalate
router.post("/queue/:postId/escalate", postIdValidation, escalatePostController);

export default router;
