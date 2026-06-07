export const getSimilarQuestionsService = async (
  questionHash,
  k,
  threshold,
) => {
  return {
    success: true,
    message: 'Service is working',
    questionHash,
    k,
    threshold,
  };
};