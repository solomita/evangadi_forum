import express from "express";
import { authenticateUser } from "../../../middleware/authentication.js";
import {
  getQuestionsController,
  getSingleQuestionController,
} from "../controller/question.controller.js";
import {
  getQuestionsValidation,
  getSingleQuestionValidation,
} from "../validations/question.validation.js";

const router = express.Router();

/**
 * @route GET /api/questions/:questionHash
 * @desc Get one question with answers
 * @access Private
 */
router.get(
  "/:questionHash",
  authenticateUser,
  getSingleQuestionValidation,
  getSingleQuestionController,
);

export default router;
