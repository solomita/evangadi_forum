import { safeExecute } from '../../../../db/config.js';
import { NotFoundError } from '../../../utils/errors/index.js';

/**
 * Compute cosine similarity between two vectors.
 *
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Similarity score between 0 and 1
 */
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

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find questions similar to a given question hash using cosine similarity.
 *
 * @param {string} questionHash - Hash of the source question
 * @param {number} k            - Max number of results to return
 * @param {number} threshold    - Minimum similarity score (0–1)
 * @returns {object} Success response with ranked similar questions
 */
export const getSimilarQuestionsService = async (questionHash, k, threshold) => {
  // --- 1. Fetch source question and its embedding ---
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

  // Parse embedding if stored as a JSON string
  const sourceVector =
    typeof sourceQuestion.embedding === 'string'
      ? JSON.parse(sourceQuestion.embedding)
      : sourceQuestion.embedding;

  // --- 2. Fetch all other question vectors ---
  const vectorsSql = `
    SELECT
      question_id,
      embedding
    FROM question_vectors
    WHERE question_id != ?
  `;

  const otherVectors = await safeExecute(vectorsSql, [sourceQuestion.question_id]);

  // --- 3. Compute cosine similarity for each candidate ---
  const similarities = [];

  for (const row of otherVectors) {
    const candidateVector =
      typeof row.embedding === 'string'
        ? JSON.parse(row.embedding)
        : row.embedding;

    const score = cosineSimilarity(sourceVector, candidateVector);

    similarities.push({ questionId: row.question_id, score });
  }

  // --- 4. Resolve threshold and limit from params or env ---
  const minThreshold =
    Number(threshold) ||
    Number(process.env.RECOMMEND_THRESHOLD) ||
    0.75;

  const limit =
    Number(k) ||
    Number(process.env.RECOMMEND_K) ||
    5;

  // --- 5. Filter by threshold, sort by score, and cap at limit ---
  const filtered = similarities
    .filter((s) => s.score >= minThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const questionIds = filtered.map((item) => item.questionId);

  // Return early if no results pass the threshold
  if (questionIds.length === 0) {
    return {
      success: true,
      message: 'Similar questions fetched successfully',
      data: [],
      meta: {
        total: 0,
        k: limit,
        threshold: minThreshold,
        query: null,
        questionHash,
      },
    };
  }

  // --- 6. Hydrate full question details for matched IDs ---
  const placeholders = questionIds.map(() => '?').join(',');

  const hydrateSql = `
    SELECT
      q.question_id,
      q.question_hash,
      q.title,
      q.content,
      q.created_at,
      q.updated_at,
      u.user_id,
      u.first_name,
      u.last_name,
      COUNT(a.answer_id) AS answer_count
    FROM questions q
    JOIN users u
      ON q.user_id = u.user_id
    LEFT JOIN answers a
      ON q.question_id = a.question_id
    WHERE q.question_id IN (${placeholders})
    GROUP BY
      q.question_id,
      q.question_hash,
      q.title,
      q.content,
      q.created_at,
      q.updated_at,
      u.user_id,
      u.first_name,
      u.last_name
  `;

  const hydratedQuestions = await safeExecute(hydrateSql, questionIds);

  // Build a map for O(1) lookup by question ID
  const questionsMap = new Map();
  for (const question of hydratedQuestions) {
    questionsMap.set(question.question_id, question);
  }

  // --- 7. Merge similarity scores with question details ---
  // Preserves the sorted similarity ranking
  const finalResults = filtered.map((item) => {
    const question = questionsMap.get(item.questionId);

    return {
      id: question.question_id,
      questionHash: question.question_hash,
      title: question.title,
      content: question.content,
      answerCount: Number(question.answer_count),
      createdAt: question.created_at,
      updatedAt: question.updated_at,
      author: {
        id: question.user_id,
        firstName: question.first_name,
        lastName: question.last_name,
      },
      score: Number(item.score.toFixed(4)),
    };
  });

  return {
    success: true,
    message: 'Similar questions fetched successfully',
    data: finalResults,
    meta: {
      total: finalResults.length,
      k: limit,
      threshold: minThreshold,
      query: null,
      questionHash,
    },
  };
};