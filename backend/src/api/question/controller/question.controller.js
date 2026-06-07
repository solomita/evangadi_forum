import { StatusCodes } from 'http-status-codes';
import { getSimilarQuestionsService } from '../service/question.service.js';

export const getSimilarQuestionsController = async (
  req,
  res,
  next,
) => {
  try {
    const { questionHash } = req.params;
    const { k, threshold } = req.query;

    const result = await getSimilarQuestionsService(
      questionHash,
      k,
      threshold,
    );

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};