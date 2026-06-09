import { body } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/validation-handler.js';

export const generateQuestionDraftCoachValidation = [
  body('title')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters long'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 20, max: 10000 })
    .withMessage('Content must be between 20 and 10000 characters long'),

  validationErrorHandler,
];
