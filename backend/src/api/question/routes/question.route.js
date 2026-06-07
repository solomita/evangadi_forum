import express from 'express';

import { getSimilarQuestionsController } from '../controller/question.controller.js';

import { getSimilarQuestionsValidation } from '../validations/question.validation.js';
// console.log('Question routes loaded');

const router = express.Router();

router.get(
  '/:questionHash/similar',
  getSimilarQuestionsValidation,
  getSimilarQuestionsController,
);

export default router;