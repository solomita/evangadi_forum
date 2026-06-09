import express from 'express';
import { authenticateUser } from '../../../middleware/authentication.js';
import { generateQuestionDraftCoachController } from '../controller/question.controller.js';
import { generateQuestionDraftCoachValidation } from '../validations/question.validation.js';

const router = express.Router();

/**
 * @route POST /api/questions/draft-coach
 * @desc Generate AI coaching feedback for a question draft
 * @access Protected
 */
router.post(
  '/draft-coach',
  authenticateUser,
  generateQuestionDraftCoachValidation,
  generateQuestionDraftCoachController,
);

export default router;
