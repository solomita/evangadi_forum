import { param } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/validation-handler.js';

/**
 * Validation rules for GET /api/questions/:questionHash/similar
 *
 * - questionHash: must be a 16-character hexadecimal string
 */
export const getSimilarQuestionsValidation = [
  param('questionHash')
    .matches(/^[a-fA-F0-9]{16}$/)
    .withMessage('Invalid question hash format'),

  validationErrorHandler,
];