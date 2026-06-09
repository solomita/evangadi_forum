import { safeExecute } from '../../../../db/config.js';
import { NotFoundError } from '../../../utils/errors/index.js';

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export const getSimilarQuestionsService = async (
  questionHash,
  k,
  threshold,
) => {
  // Find source question and embedding
  const sourceSql = `
    SELECT
      q.question_id,
      q.question_hash,
      qv.embedding
    FROM questions q
    JOIN question_vectors qv
      ON q.question_id = qv.question_id
    WHERE q.question_hash = ?
    LIMIT 1
  `;

  const rows = await safeExecute(sourceSql, [questionHash]);

  if (rows.length === 0) {
    throw new NotFoundError('Question not found');
  }

  const sourceQuestion = rows[0];

  const sourceVector =
    typeof sourceQuestion.embedding === 'string'
      ? JSON.parse(sourceQuestion.embedding)
      : sourceQuestion.embedding;

  // Get all other vectors
  const vectorsSql = `
    SELECT
      question_id,
      embedding
    FROM question_vectors
    WHERE question_id != ?
  `;

  const otherVectors = await safeExecute(vectorsSql, [
    sourceQuestion.question_id,
  ]);

  const similarities = [];

  // Calculate cosine similarity
  for (const row of otherVectors) {
    const candidateVector =
      typeof row.embedding === 'string'
        ? JSON.parse(row.embedding)
        : row.embedding;

    const score = cosineSimilarity(
      sourceVector,
      candidateVector,
    );

    similarities.push({
      questionId: row.question_id,
      score,
    });
  }

  console.log(similarities);

  return {
    success: true,
    sourceQuestion,
    similarities,
  };
};