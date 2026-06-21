import { param } from 'express-validator';
import { validationErrorHandler } from '../../../middleware/validation-handler.js';

// Validates that :documentId in the URL is a positive integer
export const documentIdParamValidation = [
  param('documentId')
    .isInt({ min: 1 })
    .withMessage('documentId must be a positive integer')
    .toInt(),

  validationErrorHandler,
];