import { apiClient } from '../core/api.client.js';

/**
 * Fetches questions from the API.
 * @param {Object} [filters] - Query parameters such as { mine: true }.
 */
async function getQuestions(filters = {}) {
  const response = await apiClient.get('/api/questions', {
    params: filters,
  });

  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.questions)) return payload.questions;
  if (Array.isArray(payload.data)) return payload.data;

  return [];
}

export const questionService = {
  getQuestions,
};
