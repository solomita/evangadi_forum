import { apiClient } from '../core/api.client.js';

function handleLeaderboardError(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return new Error('Request timed out. Please try again.');
    return new Error('Unable to connect to server. Please check your internet connection.');
  }

  const backendMessage =
    error.response.data?.error?.message ||
    error.response.data?.msg ||
    error.response.data?.message;

  return new Error(backendMessage || 'Failed to load leaderboard.');
}

async function getMonthlyLeaderboard() {
  try {
    const response = await apiClient.get('/api/leaderboard/monthly');
    return response.data?.data || { period: null, data: [] };
  } catch (error) {
    throw handleLeaderboardError(error);
  }
}

async function getAllTimeLeaderboard() {
  try {
    const response = await apiClient.get('/api/leaderboard/alltime');
    return response.data?.data || { data: [] };
  } catch (error) {
    throw handleLeaderboardError(error);
  }
}

export const leaderboardService = { getMonthlyLeaderboard, getAllTimeLeaderboard };
