import { param } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/validation-handler.js';

export const getSimilarQuestionsValidation = [
  param('questionHash')
    .matches(/^[a-fA-F0-9]{16}$/)
    .withMessage('Invalid question hash format'),

  validationErrorHandler,
];